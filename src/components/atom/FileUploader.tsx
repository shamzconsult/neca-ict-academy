'use client';
import { FiFileText, FiImage, FiX } from 'react-icons/fi';
import { useState } from 'react';

interface FileUploaderProps {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  fileType?: 'cv' | 'image' | 'generic';
  onFileChange: (file: File | null) => void;
  currentFile?: File | null;
}

export const FileUploader = ({
  label,
  name,
  required = false,
  accept,
  fileType = 'generic',
  onFileChange,
  currentFile = null,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(currentFile);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    onFileChange(null);
  };

  const getIcon = () => {
    switch (fileType) {
      case 'cv':
        return <FiFileText className="text-gray-500 text-xl flex-shrink-0" />;
      case 'image':
        return <FiImage className="text-gray-500 text-xl flex-shrink-0" />;
      default:
        return <FiFileText className="text-gray-500 text-xl flex-shrink-0" />;
    }
  };

  const getPlaceholder = () => {
    switch (fileType) {
      case 'cv':
        return 'Choose PDF or DOC file';
      case 'image':
        return 'Choose image file';
      default:
        return 'Choose file';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
        {label}
      </label>
      <div className="relative h-14">
        <div className="flex items-center gap-3 p-3 h-full border border-[#1E1E1E] rounded-md focus-within:ring focus-within:ring-[#1E1E1E] cursor-pointer">
          {getIcon()}
          <input
            type="file"
            name={name}
            accept={accept}
            required={required}
            onChange={handleFileChange}
            className="w-full opacity-0 absolute inset-0 cursor-pointer"
          />
          {file ? (
            <div className="flex items-center gap-2 w-full min-w-0">
              <span className="text-gray-700 text-sm truncate flex-1 min-w-0">
                {file.name}
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm truncate">
              {getPlaceholder()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};