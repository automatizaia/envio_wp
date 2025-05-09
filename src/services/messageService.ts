
import { Contact, SupabaseContact } from "@/types/contacts";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";

// Fetch contacts from Supabase where status is "SIM"
export const fetchEligibleContacts = async (): Promise<Contact[]> => {
  try {
    // Real Supabase query for "clientes" table, filtering by status="SIM"
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("status", "SIM");
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // If no real data, fall back to mock data for development
      console.log("No contacts found in Supabase, using mock data");
      const mockContactsData: SupabaseContact[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Contact ${i + 1}`,
        phone: `+55119${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: "SIM",
        created_at: new Date().toISOString(),
      }));
      
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockContactsData;
    }
    
    // Map to our Contact type format
    const contacts: Contact[] = data.map(item => ({
      id: item.id.toString(),
      name: item.name || item.nome, // Handle both possible field names
      phone: item.phone || item.telefone, // Handle both possible field names
      status: item.status,
      created_at: item.created_at,
    }));
    
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    toast({
      title: "Falha ao carregar contatos",
      description: "Não foi possível buscar contatos do banco de dados. Tente novamente.",
      variant: "destructive",
    });
    return [];
  }
};

// Parse contacts from CSV file
export const parseCsvContacts = async (file: File): Promise<Contact[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split("\n");
        
        // Skip header row and parse data
        const contacts: Contact[] = [];
        let id = 1;
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [name, phone, status = "SIM"] = line.split(",").map(item => item.trim());
            
            if (name && phone) {
              contacts.push({
                id: `csv-${id++}`,
                name,
                phone: phone.replace(/[^\d+]/g, ""), // Clean phone number
                status,
              });
            }
          }
        }
        
        resolve(contacts);
      } catch (error) {
        console.error("CSV parsing error:", error);
        reject(new Error("Invalid CSV format"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading CSV file"));
    };
    
    reader.readAsText(file);
  });
};

// Send messages via webhook
export const sendMessagesViaWebhook = async (
  contacts: Contact[],
  message: string,
  pdfFile: File | null,
  onProgressUpdate: (sent: number, progress: number) => void
): Promise<boolean> => {
  try {
    const n8nWebhookUrl = "https://n8n.automacao.store/webhook/envio";
    
    // If there's a PDF file, we'd normally upload it to a storage service
    // and get a URL to include in the payload
    let pdfUrl = null;
    if (pdfFile) {
      // Simulating file upload to get URL
      pdfUrl = `https://example.com/files/${pdfFile.name}`;
    }
    
    // In a real implementation, you might want to batch this
    // to avoid overloading the webhook
    const totalContacts = contacts.length;
    
    for (let i = 0; i < totalContacts; i++) {
      const contact = contacts[i];
      
      // Prepare personalized message for this contact
      const personalizedMessage = message
        .replace(/{name}/g, contact.name)
        .replace(/{pdf_link}/g, pdfUrl || "");
      
      // Send to webhook
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: contact.phone,
          message: personalizedMessage,
          pdfUrl,
          contactName: contact.name,
        }),
      });
      
      // Update progress
      const sent = i + 1;
      const progressPercentage = (sent / totalContacts) * 100;
      onProgressUpdate(sent, progressPercentage);
      
      // Add small delay between messages
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    return true;
  } catch (error) {
    console.error("Error sending messages:", error);
    toast({
      title: "Falha no envio",
      description: "Falha ao enviar mensagens. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};
