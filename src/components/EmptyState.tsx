import React from "react";
import { CameraIcon } from "@heroicons/react/24/solid";

const EmptyState: React.FC = () => (
  <div className="fixed inset-0 flex justify-center items-center p-4">
    <div className="text-center">
      <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No Images Found
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Upload images to see them here.
      </p>
    </div>
  </div>
);

export default EmptyState;
