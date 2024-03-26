import { useState, useEffect } from "react";

import { ImageStorageError } from "../utils/CustomError";
import { ImageRecord } from "../types";

function useImageStorage() {
	const [db, setDb] = useState<IDBDatabase | undefined | null>(null);

	useEffect(() => {
		const idbOpen = () => {
			const request = indexedDB.open("imagesDatabase", 1);
			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains("images")) {
					db.createObjectStore("images", {
						keyPath: "id",
						autoIncrement: true,
					});
				}
			};

			request.onsuccess = (event) => {
				setDb((event.target as IDBOpenDBRequest).result);
			};

			request.onerror = (event) => {
				console.error(
					"IndexedDB opening error:",
					(event.target as IDBOpenDBRequest).error,
				);
			};
		};
		idbOpen();
	}, []);

	async function storeImage(blob: Blob, title?: string, description?: string) {
		if (!db) {
			throw new Error("IndexDB is not initialized.");
		}

		const tx = db.transaction("images", "readwrite");
		const store = tx.objectStore("images");
		const timestamp = new Date();
		const imageRecord: ImageRecord = {
			url: URL.createObjectURL(blob),
			title,
			description,
			timestamp,
		};
		store.add(imageRecord);

		return new Promise((resolve, reject) => {
			tx.oncomplete = () => {
				resolve(imageRecord);
			};
			tx.onerror = () => {
				reject(
					new ImageStorageError(
						"[storeImage] failed to record image. ${tx.error}",
					),
				);
			};
		});
	}

	async function fetchImages() {
		if (!db) {
			throw new Error("IndexDB is not initialized.");
		}

		const tx = db.transaction("images", "readonly");
		const store = tx.objectStore("images");

		return new Promise<ImageRecord[]>((resolve, reject) => {
			const request = store.getAll();
			request.onsuccess = () => {
				resolve(
					request.result.reverse().map((imageRecord: ImageRecord) => ({
						url: imageRecord.url,
						title: imageRecord.title,
						description: imageRecord.description,
						timestamp: imageRecord.timestamp,
					})),
				);
			};
			request.onerror = () => {
				reject(
					new ImageStorageError(
						"[fetchImages] failed. ${request.error.message}",
					),
				);
			};
		});
	}

	return { storeImage, fetchImages, isLoading: !db };
}

export { useImageStorage };
