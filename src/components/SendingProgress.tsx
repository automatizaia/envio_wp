
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageSquare } from "lucide-react";

interface SendingProgressProps {
  sending: boolean;
  progress: number;
  totalContacts: number;
  sentContacts: number;
}

const SendingProgress: React.FC<SendingProgressProps> = ({
  sending,
  progress,
  totalContacts,
  sentContacts,
}) => {
  return (
    sending ? (
      <Card className="bg-white/50 backdrop-blur-sm border-whatsapp/50 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <MessageSquare className="h-12 w-12 text-whatsapp animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center text-whatsapp">
            Sending Messages...
          </h3>
          
          <Progress value={progress} className="h-2" />
          
          <p className="text-center text-sm text-gray-600">
            Sent to {sentContacts} of {totalContacts} contacts
          </p>
        </CardContent>
      </Card>
    ) : null
  );
};

export default SendingProgress;
