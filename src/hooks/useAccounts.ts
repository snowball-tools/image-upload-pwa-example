import { useEffect, useState } from "react";
import { BaseProvider, LitAuthClient } from "@lit-protocol/lit-auth-client";
import { ProviderType, AuthMethodType } from "@lit-protocol/constants";
import {
	IRelayPKP,
	IRelayPollStatusResponse,
	AuthMethod,
	AccessControlConditions,
} from "@lit-protocol/types";
import { useStytchUser, useStytch } from "@stytch/react";
import { useEncryption } from "./useEncryption";

const accessControlConditions: AccessControlConditions = [
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

const litAuthClient: LitAuthClient = new LitAuthClient({
	litRelayConfig: {
		relayApiKey: "15DDD969-E75F-404D-AAD9-58A37C4FD354_snowball",
	},
});

export const useAccounts = () => {
	const { user } = useStytchUser();
	const stytch = useStytch();
	const [authMethod, setAuthMethod] = useState<AuthMethod>();
	const [pkps, setPkps] = useState<IRelayPKP[] | IRelayPollStatusResponse[]>(
		[],
	);
	const encryption = useEncryption();

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

			const encrypted = await encryption.encrypt({
				provider,
				pkp,
				dataToEncrypt,
				authMethod,
				accessControlConditions,
			});

			return encrypted;
		}
	};

	const decrypt = async (ciphertext: string, dataToDecryptHash: string) => {
		if (authMethod) {
			const provider = getProviderByAuthMethod(authMethod);
			const pkp = (pkps[0] as IRelayPKP).publicKey
				? (pkps[0] as IRelayPKP).publicKey
				: (pkps[0] as IRelayPollStatusResponse).pkpPublicKey;

			if (!provider || !pkp) {
				return;
			}

			const decrypted = await encryption.decrypt({
				provider,
				pkp,
				authMethod,
				accessControlConditions,
				dataToDecryptHash,
				ciphertext,
			});

			return decrypted;
		}
	};

	return { authMethod, pkps, encrypt, decrypt };
};
