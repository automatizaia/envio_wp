
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, TrashIcon, FileCsv, FilePdf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  fileType: "pdf" | "csv";
  onFileUploaded: (file: File) => void;
  onFileDeleted?: () => void;
  fileName?: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  fileType,
  onFileUploaded,
  onFileDeleted,
  fileName,
}) => {
  const [internalFileName, setInternalFileName] = useState<string | null>(fileName || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptType = fileType === "pdf" ? ".pdf" : ".csv";
  const fileTypeLabel = fileType === "pdf" ? "PDF" : "CSV";
  const iconComponent = fileType === "pdf" ? (
    <FilePdf className="h-5 w-5" />
  ) : (
    <FileCsv className="h-5 w-5" />
  );

  // Update internal state when prop changes
  React.useEffect(() => {
    setInternalFileName(fileName || null);
  }, [fileName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const extension = file.name.split(".").pop()?.toLowerCase();
    if ((fileType === "pdf" && extension !== "pdf") || 
        (fileType === "csv" && extension !== "csv")) {
      toast({
        title: "Invalid file type",
        description: `Please upload a ${fileTypeLabel} file.`,
        variant: "destructive",
      });
      return;
    }
    
    setInternalFileName(file.name);
    onFileUploaded(file);
    
    // Reset file input value to allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDeleteFile = () => {
    setInternalFileName(null);
    if (onFileDeleted) {
      onFileDeleted();
    }
    toast({
      title: `${fileTypeLabel} deleted`,
      description: `${fileTypeLabel} file has been removed.`,
    });
  };

  return (
    <div>
      <input
        type="file"
        accept={acceptType}
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={handleButtonClick}
          className="w-full bg-whatsapp hover:bg-whatsapp-dark flex items-center gap-2"
        >
          {iconComponent}
          {internalFileName ? `Change ${fileTypeLabel}` : `Upload ${fileTypeLabel}`}
        </Button>
        
        {internalFileName && (
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 border rounded">
            <div className="flex items-center gap-2 overflow-hidden">
              {fileType === "pdf" ? (
                <FilePdf className="h-4 w-4 text-red-500 flex-shrink-0" />
              ) : (
                <FileCsv className="h-4 w-4 text-green-500 flex-shrink-0" />
              )}
              <span className="truncate text-sm">{internalFileName}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
              onClick={handleDeleteFile}
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete {fileTypeLabel}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
