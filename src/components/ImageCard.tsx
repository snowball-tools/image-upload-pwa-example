import React, { useEffect, useState } from "react";

import { ImageRecord } from "../hooks/useImageStorage";

const ImageCard: React.FC<{ image: ImageRecord; index: number, decrypt: (ciphertext: string, dataToEncryptHash: string) => Promise<string | undefined> }> = ({
  image,
  index,
  decrypt,
}) => {
  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    async function handle() {
      if (!text && image.description) {
        try {
          const a = JSON.parse(image.description) as { ciphertext: string; dataToEncryptHash: string };
          if (a.ciphertext) {
            console.log(a);
            setText(await decrypt(a.ciphertext, a.dataToEncryptHash));
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    handle();
  }, [text]);

  return (
    <div key={index} className="w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={image.url}
          alt={`Uploaded ${index.toString()}`}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{text ?? "Untitled"}</h3>
          <p className="text-gray-600">
            {image.description ?? "No description"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
