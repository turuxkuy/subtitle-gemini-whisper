
import React, { useCallback, useState } from "react";
import { Upload, FileIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  file: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.name.endsWith(".srt")) {
          onFileUpload(droppedFile);
        } else {
          alert("Please upload an SRT file");
        }
      }
    },
    [onFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        if (selectedFile.name.endsWith(".srt")) {
          onFileUpload(selectedFile);
        } else {
          alert("Please upload an SRT file");
        }
        e.target.value = "";
      }
    },
    [onFileUpload]
  );

  const handleRemoveFile = useCallback(() => {
    onFileUpload(null as unknown as File);
  }, [onFileUpload]);

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "drop-area",
            isDragging ? "active" : "border-gray-300"
          )}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 mb-4 text-primary" />
            <p className="text-lg mb-2">
              Seret & lepas file SRT di sini
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              atau
            </p>
            <Button
              onClick={() => document.getElementById("fileInput")?.click()}
              variant="outline"
            >
              Pilih File
            </Button>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".srt"
              onChange={handleFileInput}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium truncate max-w-[200px] md:max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
