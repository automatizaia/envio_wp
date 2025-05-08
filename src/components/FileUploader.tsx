
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  fileType: "pdf" | "csv";
  onFileUploaded: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  fileType,
  onFileUploaded,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptType = fileType === "pdf" ? ".pdf" : ".csv";
  const fileTypeLabel = fileType === "pdf" ? "PDF" : "CSV";
  const iconComponent = fileType === "pdf" ? (
    <FileText className="h-5 w-5" />
  ) : (
    <Upload className="h-5 w-5" />
  );

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
    
    setFileName(file.name);
    onFileUploaded(file);
    
    // Reset file input value to allow uploading the same file again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
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
      
      <Button
        type="button"
        onClick={handleButtonClick}
        className="w-full bg-whatsapp hover:bg-whatsapp-dark flex items-center gap-2"
      >
        {iconComponent}
        {fileName ? `Change ${fileTypeLabel}` : `Upload ${fileTypeLabel}`}
      </Button>
      
      {fileName && (
        <div className="mt-2 text-sm flex items-center gap-2">
          {fileType === "pdf" ? (
            <FileText className="h-4 w-4 text-red-500" />
          ) : (
            <Upload className="h-4 w-4 text-green-500" />
          )}
          <span className="truncate">{fileName}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
