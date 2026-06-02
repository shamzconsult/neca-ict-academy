"use client";

import { FiX } from "react-icons/fi";
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  icon: ReactNode;
  placeholder: string;
  onFileChange: (file: File | null) => void;
  currentFile?: File | null;
  maxSize?: number;
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
  maxSize,
}: FileUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (maxSize && file.size > maxSize) {
        alert(`File size must be less than ${Math.round(maxSize / 1024)}KB.`);
        e.target.value = "";
        onFileChange(null);
        return;
      }

      if (accept === ".pdf" && file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        e.target.value = "";
        onFileChange(null);
        return;
      }
    }
    onFileChange(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    const input = e.currentTarget
      .closest("div")
      ?.querySelector('input[type="file"]');
    if (input) (input as HTMLInputElement).value = "";
  };

  return (
    <div className="space-y-1.5 text-left">
      <Label className="text-[#27156F]">
        {label}
        {required && <span className="text-[#E02B20]"> *</span>}
      </Label>
      <div className="relative h-11">
        <div
          className={cn(
            "flex h-full items-center gap-3 rounded-lg border border-[#27156F]/15 bg-white px-3 shadow-xs transition",
            "cursor-pointer hover:border-[#27156F]/30 focus-within:border-[#27156F]/40 focus-within:ring-2 focus-within:ring-[#27156F]/20",
            currentFile && "border-[#27156F]/25 bg-[#DBEAF6]/20"
          )}
        >
          <div className="shrink-0 text-[#27156F]/60">{icon}</div>
          <input
            type="file"
            name={name}
            accept={accept}
            required={required}
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          {currentFile ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm text-[#27156F]">
                {currentFile.name}
              </span>
              <button
                type="button"
                onClick={clearFile}
                className="shrink-0 rounded-md p-0.5 text-gray-500 transition-colors hover:bg-[#27156F]/10 hover:text-[#27156F]"
                aria-label={`Clear ${label}`}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <span className="truncate text-sm text-gray-400">{placeholder}</span>
          )}
        </div>
      </div>
    </div>
  );
};
