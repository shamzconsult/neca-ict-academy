'use client';
import { FiX } from 'react-icons/fi';
import { ReactNode } from 'react';

interface FileUploaderProps {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  icon: ReactNode;
  placeholder: string;
  onFileChange: (file: File | null) => void;
  currentFile?: File | null;
}

export const FileUploader = ({
  label,
  name,
  required = false,
  accept,
  icon,
  placeholder,
  onFileChange,
  currentFile = null,
}: FileUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    // Clear input value
    const input = e.currentTarget.closest('div')?.querySelector('input[type="file"]');
    if (input) (input as HTMLInputElement).value = '';
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 text-left mb-2">
        {label}
        {required }
      </label>
      <div className="relative h-14">
        <div className="flex items-center gap-3 p-3 h-full border border-[#1E1E1E] rounded-md focus-within:ring-1 focus-within:ring-[#1E1E1E] cursor-pointer hover:border-[#1E1E1E]/80 transition-colors">
          <div className="text-gray-500 text-xl flex-shrink-0">
            {icon}
          </div>
          <input
            type="file"
            name={name}
            accept={accept}
            required={required}
            onChange={handleFileChange}
            className="w-full opacity-0 absolute inset-0 cursor-pointer"
          />
          {currentFile ? (
            <div className="flex items-center gap-2 w-full min-w-0">
              <span className="text-gray-700 text-sm truncate flex-1 min-w-0">
                {currentFile.name}
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors"
                aria-label={`Clear ${label}`}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm truncate">
              {placeholder}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};