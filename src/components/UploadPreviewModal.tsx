import React, { useState, useEffect } from "react";

const UploadPreviewModal: React.FC<{
  isOpen: boolean;
  preview: string | null;
  onSubmit: (title?: string, description?: string) => void;
  onCancel: () => void;
}> = ({ isOpen, preview, onSubmit, onCancel }) => {
  const [localTitle, setLocalTitle] = useState<string | undefined>();
  const [localDescription, setLocalDescription] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (preview) {
      setLocalTitle("");
      setLocalDescription("");
    }
  }, [preview]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 ${!isOpen && "hidden"}`}
    >
      {isOpen && (
        <div className="bg-white rounded-lg p-5 max-w-3xl w-full mx-auto">
          {preview && (
            <>
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain mx-auto block"
              />
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="text-lg font-semibold w-full rounded mb-1 p-2"
                />
                <textarea
                  placeholder="Description"
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  className="text-gray-600 w-full rounded mb-4 p-2"
                />
              </div>
            </>
          )}
          <div className="flex justify-between">
            <button
              onClick={() => onSubmit(localTitle, localDescription)}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Upload Image
            </button>
            <button
              onClick={onCancel}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPreviewModal;
