
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";
import { Contact } from "@/types/contacts";

import MessageComposer from "@/components/MessageComposer";
import MessagePreview from "@/components/MessagePreview";
import FileUploader from "@/components/FileUploader";
import ContactList from "@/components/ContactList";
import SendingProgress from "@/components/SendingProgress";
import { 
  fetchEligibleContacts, 
  parseCsvContacts,
  sendMessagesViaWebhook 
} from "@/services/messageService";

const Index = () => {
  // State management
  const [message, setMessage] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendingProgress, setSendingProgress] = useState<number>(0);
  const [sentCount, setSentCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState<"supabase" | "csv">("supabase");

  // Load contacts from Supabase when the component mounts
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      const eligibleContacts = await fetchEligibleContacts();
      setContacts(eligibleContacts);
      setSelectedContacts(eligibleContacts.map(c => c.id));
      setIsLoading(false);
    };

    if (dataSource === "supabase") {
      loadContacts();
    }
  }, [dataSource]);

  // Handle PDF file upload
  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
    toast({
      title: "PDF uploaded",
      description: `${file.name} will be attached to your messages.`,
    });
  };

  // Handle CSV file upload
  const handleCsvUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const csvContacts = await parseCsvContacts(file);
      setContacts(csvContacts);
      setSelectedContacts(csvContacts.map(c => c.id));
      toast({
        title: "CSV imported",
        description: `Successfully loaded ${csvContacts.length} contacts.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Could not parse CSV file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle contact selection
  const handleToggleContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  // Toggle all contacts
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  // Handle message sending
  const handleSendMessages = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No contacts selected",
        description: "Please select at least one contact to send messages to.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "No message content",
        description: "Please compose a message before sending.",
        variant: "destructive",
      });
      return;
    }

    // Get the selected contacts
    const selectedContactsList = contacts.filter(c => 
      selectedContacts.includes(c.id)
    );

    // Start sending process
    setIsSending(true);
    setSendingProgress(0);
    setSentCount(0);

    // Call webhook with progress updates
    const success = await sendMessagesViaWebhook(
      selectedContactsList,
      message,
      pdfFile,
      (sent, progress) => {
        setSentCount(sent);
        setSendingProgress(progress);
      }
    );

    if (success) {
      toast({
        title: "Messages sent",
        description: `Successfully sent to ${selectedContactsList.length} contacts.`,
      });
    }

    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-whatsapp" />
            <h1 className="text-3xl font-bold text-gray-800">WhatsApp Bulk Sender</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Send personalized WhatsApp messages to multiple contacts
          </p>
        </header>

        {isSending && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
            <SendingProgress
              sending={isSending}
              progress={sendingProgress}
              totalContacts={selectedContacts.length}
              sentContacts={sentCount}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Message composition and file upload */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="message" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Message</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="message" className="space-y-6">
                    <MessageComposer 
                      message={message}
                      setMessage={setMessage}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Attach PDF (Optional)</h3>
                        <FileUploader 
                          fileType="pdf"
                          onFileUploaded={handlePdfUpload}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <MessagePreview 
                      message={message}
                      pdfFileName={pdfFile?.name || null}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Contact data source selector */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Source</h2>
                
                <Tabs 
                  value={dataSource} 
                  onValueChange={(value) => setDataSource(value as "supabase" | "csv")}
                  className="space-y-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="supabase">Supabase DB</TabsTrigger>
                    <TabsTrigger value="csv">CSV Import</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="supabase" className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Contacts will be loaded from the Supabase "clients" table where status is "SIM".
                    </p>
                    
                    <Button 
                      onClick={() => {
                        setContacts([]);
                        setSelectedContacts([]);
                        fetchEligibleContacts().then(data => {
                          setContacts(data);
                          setSelectedContacts(data.map(c => c.id));
                        });
                      }}
                      disabled={isLoading || isSending}
                      variant="outline"
                    >
                      Refresh Contacts
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="csv" className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Upload a CSV file with columns: name, phone, status (optional)
                    </p>
                    
                    <FileUploader 
                      fileType="csv"
                      onFileUploaded={handleCsvUpload}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Contact list and send button */}
          <div className="space-y-6">
            <ContactList 
              contacts={contacts}
              selectedContacts={selectedContacts}
              onToggleContact={handleToggleContact}
              onToggleAll={handleToggleAll}
            />
            
            <div className="sticky bottom-0 pt-4">
              <Button 
                className="w-full bg-whatsapp hover:bg-whatsapp-dark flex items-center justify-center gap-2 py-6 text-lg"
                disabled={
                  isSending || 
                  isLoading || 
                  selectedContacts.length === 0 || 
                  !message.trim()
                }
                onClick={handleSendMessages}
              >
                <Send className="h-5 w-5" />
                Send Messages ({selectedContacts.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
