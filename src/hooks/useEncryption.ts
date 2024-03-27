import { useCallback } from "react";
import { SessionSigs } from "@lit-protocol/types";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { encryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { DecryptParams, EncryptParams, UseEncryptionParams } from "../types";

export const useEncryption = () => {
	const getSessionSigs = async (
		params: UseEncryptionParams,
	): Promise<SessionSigs> => {
		const sessionSig = params.provider.getSessionSigs({
			authMethod: params.authMethod,
			pkpPublicKey: params.pkp,
			sessionSigsParams: {
				chain: "ethereum", // todo dynamic
				resourceAbilityRequests: [
					{
						resource: new LitActionResource("*"),
						ability: LitAbility.PKPSigning,
					},
				],
			},
		});

		if (Object.keys(sessionSig).length === 0) {
			throw new Error("Session signatures could not be obtained.");
		}

		return sessionSig;
	};

	const encrypt = useCallback(
		async (params: EncryptParams): Promise<string> => {
			const sessionSigs = await getSessionSigs(params);

			const result = await encryptString(
				{
					sessionSigs,
					accessControlConditions: params.accessControlConditions,
					dataToEncrypt: params.dataToEncrypt,
					chain: "ethereum", // todo dynamic
				},
				params.provider.litNodeClient,
			);
			return result.ciphertext;
		},
		[getSessionSigs],
	);

	const decrypt = useCallback(
		async (params: DecryptParams): Promise<string> => {
			const sessionSigs = await getSessionSigs(params);

			const result = await decryptToString(
				{
					sessionSigs,
					accessControlConditions: params.accessControlConditions,
					ciphertext: params.ciphertext,
					dataToEncryptHash: params.dataToDecryptHash,
					chain: "ethereum", // todo dynamic
				},
				params.provider.litNodeClient,
			);
			return result;
		},
		[getSessionSigs],
	);

	return { encrypt, decrypt };
};
