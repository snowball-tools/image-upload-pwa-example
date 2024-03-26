import { useCallback } from "react";
import { SessionSigs } from "@lit-protocol/types";
import { LitAbility, LitActionResource } from "@lit-protocol/auth-helpers";
import { encryptString, decryptToString } from "@lit-protocol/lit-node-client";
import {
	DecryptParams,
	EncryptParams,
	OperationParams,
	Operations,
	UseEncryptionParams,
} from "../types";

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

	const performOperation = useCallback(
		async <T extends Operations>(
			operation: T,
			params: OperationParams[T],
		): Promise<string> => {
			const sessionSigs = await getSessionSigs(params);

			switch (operation) {
				case Operations.encrypt: {
					const encryptParams = params as EncryptParams;
					const result = await encryptString(
						{
							sessionSigs,
							accessControlConditions: encryptParams.accessControlConditions,
							dataToEncrypt: encryptParams.dataToEncrypt,
							chain: "ethereum", // todo dynamic
						},
						encryptParams.provider.litNodeClient,
					);
					return result.ciphertext;
				}
				case Operations.decrypt: {
					const decryptParams = params as DecryptParams;
					const result = await decryptToString(
						{
							sessionSigs,
							accessControlConditions: decryptParams.accessControlConditions,
							ciphertext: decryptParams.ciphertext,
							dataToEncryptHash: decryptParams.dataToDecryptHash,
							chain: "ethereum", // todo dynamic
						},
						decryptParams.provider.litNodeClient,
					);
					return result;
				}
				default:
					throw new Error("Unsupported operation.");
			}
		},
		[],
	);

	return {
		performOperation,
	};
};
