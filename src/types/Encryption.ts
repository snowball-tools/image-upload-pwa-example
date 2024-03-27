import { BaseProvider } from "@lit-protocol/lit-auth-client";
import { AccessControlConditions, AuthMethod } from "@lit-protocol/types";

export interface UseEncryptionParams {
	authMethod: AuthMethod;
	provider: BaseProvider;
	pkp: string;
	accessControlConditions: AccessControlConditions;
}

export interface EncryptParams extends UseEncryptionParams {
	dataToEncrypt: string;
}

export interface DecryptParams extends UseEncryptionParams {
	ciphertext: string;
	dataToDecryptHash: string;
}

export enum Operations {
	encrypt,
	decrypt,
}

export interface OperationParams {
	[Operations.encrypt]: EncryptParams;
	[Operations.decrypt]: DecryptParams;
}
