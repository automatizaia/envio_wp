
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface MessagePreviewProps {
  message: string;
  pdfFileName: string | null;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  message,
  pdfFileName,
}) => {
  // Replace placeholder tokens with example values
  const previewMessage = message
    .replace(/{name}/g, "João")
    .replace(/{pdf_link}/g, pdfFileName ? `Link for: ${pdfFileName}` : "[PDF link will appear here]");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-whatsapp" />
        <h2 className="text-lg font-semibold">Message Preview</h2>
      </div>
      
      <Card className="bg-[#DCF8C6] border-whatsapp/20">
        <CardContent className="p-4 space-y-2">
          <p className="whitespace-pre-wrap break-words text-gray-800">
            {previewMessage || "Your message preview will appear here..."}
          </p>
          {pdfFileName && (
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-md">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v2h6V7zm0 4H7v2h6v-2zm2-8H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h10v14z" />
              </svg>
              <span className="text-sm font-medium">{pdfFileName}</span>
            </div>
          )}
          <div className="text-xs text-right text-gray-500">
            {new Date().toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagePreview;
