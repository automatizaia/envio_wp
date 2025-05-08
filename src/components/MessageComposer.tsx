
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface MessageComposerProps {
  message: string;
  setMessage: (message: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  message,
  setMessage,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-whatsapp" />
        <h2 className="text-lg font-semibold">Compose Message</h2>
      </div>
      
      <Textarea
        placeholder="Enter your message here... 
Use {name} to personalize with the contact's name.
Use {pdf_link} to include the PDF link (if uploaded)."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[150px] resize-y"
      />
    </div>
  );
};

export default MessageComposer;
