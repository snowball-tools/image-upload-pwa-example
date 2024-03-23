import { useEffect, useState } from "react";
import { BaseProvider, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType, AuthMethodType } from "@lit-protocol/constants";
import {
  IRelayPKP,
  IRelayPollStatusResponse,
  AuthMethod,
  SessionSigs,
} from "@lit-protocol/types";
import { useStytchUser, useStytch } from "@stytch/react";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { encryptString, decryptToString } from "@lit-protocol/lit-node-client";

const litAuthClient: LitAuthClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: "15DDD969-E75F-404D-AAD9-58A37C4FD354_snowball",
  },
});

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0", // 0 ETH, so anyone can open
    },
  },
];

export const useAccounts = () => {
	const { user } = useStytchUser();
	const stytch = useStytch();
	const [authMethod, setAuthMethod] = useState<AuthMethod>();
	const [pkps, setPkps] = useState<IRelayPKP[] | IRelayPollStatusResponse[]>(
		[],
	);

	useEffect(() => {
		async function handle() {
			if (user && !authMethod && !pkps.length) {
				const a = stytch.session.getTokens();
				const s = stytch.session.getSync();
				const userId = s?.user_id;
				const accessToken = a?.session_jwt;

				const provider = litAuthClient.initProvider(ProviderType.StytchOtp, {
					userId,
					appId: "project-test-5bbaefc1-6145-4e14-8cca-8a4e154d599a",
				});

				const authMethod = await provider.authenticate({
					accessToken,
				});

				setAuthMethod(authMethod);

				const allPKPs = await provider.fetchPKPsThroughRelayer(authMethod);

				// check if we have pkps, if we dont then create one
				let pkps = [];
				if (allPKPs.length === 0) {
					const pkp = await provider.relay.pollRequestUntilTerminalState(
						await provider.mintPKPThroughRelayer(authMethod),
					);
					pkps = [pkp];
				} else {
					pkps = allPKPs;
				}

				setPkps(pkps);
			}
		}
		handle();
	}, [stytch, user, authMethod, pkps]);

	function getProviderByAuthMethod(
		authMethod: AuthMethod,
	): BaseProvider | undefined {
		switch (authMethod.authMethodType) {
			case AuthMethodType.GoogleJwt:
				return litAuthClient.getProvider(ProviderType.Google);
			case AuthMethodType.Discord:
				return litAuthClient.getProvider(ProviderType.Discord);
			case AuthMethodType.EthWallet:
				return litAuthClient.getProvider(ProviderType.EthWallet);
			case AuthMethodType.WebAuthn:
				return litAuthClient.getProvider(ProviderType.WebAuthn);
			case AuthMethodType.StytchEmailFactorOtp:
				return litAuthClient.getProvider(ProviderType.StytchEmailFactorOtp);
			case AuthMethodType.StytchSmsFactorOtp:
				return litAuthClient.getProvider(ProviderType.StytchSmsFactorOtp);
			case AuthMethodType.StytchOtp:
				return litAuthClient.getProvider(ProviderType.StytchOtp);
			default:
				return undefined;
		}
	}

	const encrypt = async (dataToEncrypt: string) => {
		if (authMethod) {
			const provider = getProviderByAuthMethod(authMethod);
			const pkp = (pkps[0] as IRelayPKP).publicKey
				? (pkps[0] as IRelayPKP).publicKey
				: (pkps[0] as IRelayPollStatusResponse).pkpPublicKey;

			if (!provider || !pkp) {
				return;
			}

			const sessionSigs = await provider.getSessionSigs({
				authMethod,
				pkpPublicKey: pkp,
				sessionSigsParams: {
					chain: "ethereum",
					resourceAbilityRequests: [
						{
							resource: new LitActionResource("*"),
							ability: LitAbility.PKPSigning,
						},
					],
				},
			});

			const result = await encryptString(
				{
					sessionSigs,
					accessControlConditions,
					dataToEncrypt,
					chain: "ethereum",
				},
				provider.litNodeClient,
			);

			return result;
		}
	};

	const decrypt = async (ciphertext: string, dataToEncryptHash: string) => {
		if (authMethod) {
			const provider = getProviderByAuthMethod(authMethod);
			const pkp = (pkps[0] as IRelayPKP).publicKey
				? (pkps[0] as IRelayPKP).publicKey
				: (pkps[0] as IRelayPollStatusResponse).pkpPublicKey;
			if (!provider || !pkp) {
				return;
			}

			const sessionSigs: SessionSigs = await provider.getSessionSigs({
				authMethod,
				pkpPublicKey: pkp,
				sessionSigsParams: {
					chain: "ethereum",
					resourceAbilityRequests: [
						{
							resource: new LitActionResource("*"),
							ability: LitAbility.PKPSigning,
						},
					],
				},
			});
			if (Object.keys(sessionSigs).length !== 0) {
				const result = await decryptToString(
					{
						sessionSigs,
						accessControlConditions,
						ciphertext,
						dataToEncryptHash,
						chain: "ethereum",
					},
					provider.litNodeClient,
				);

				return result;
			}
		}
	};

	return { authMethod, pkps, encrypt, decrypt };
};
