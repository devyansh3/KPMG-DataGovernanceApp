import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

function FileUploadModal({ isOpen, onClose }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map((file) => file.name);
    setUploadedFiles((prevFiles) => [...prevFiles, ...fileNames]);
  };

  const removeFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileName)
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Upload Documents
            </h2>
            <div>
              {/* File Upload Input */}
              <div className="flex items-center justify-center w-full mb-4">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* Display Uploaded Files */}
              <div className="mb-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md mb-2"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {file}
                    </span>
                    <button
                      onClick={() => removeFile(file)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default FileUploadModal;
