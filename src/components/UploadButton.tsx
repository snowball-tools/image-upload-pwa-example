import React from "react";
import { CameraIcon } from "@heroicons/react/24/solid";

const UploadButton: React.FC<{
	  isLoading: boolean;
	  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	  fileInputRef: React.RefObject<HTMLInputElement>;
	}> = ({ isLoading, handleImageChange, fileInputRef }) => {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center">
      {isLoading ? (
        <div className="cursor-not-allowed bg-blue-500 text-white font-bold py-2 px-8 rounded-full shadow-lg flex items-center justify-center opacity-50">
          <CameraIcon className="w-6 h-6 mr-2" />
          <span>Working...</span>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-blue-500 text-white font-bold py-2 px-8 rounded-full shadow-lg flex items-center justify-center"
        >
          <CameraIcon className="w-6 h-6 mr-2" />
          <span>Upload</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </label>
      )}
    </div>
  );
};

export default UploadButton;
