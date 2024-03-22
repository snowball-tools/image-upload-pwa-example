export class ImageStorageError extends Error {
	constructor(message?: string) {
		super(message ?? "ImageStorageError");
		this.name = "ImageStorageError";
	}
}
