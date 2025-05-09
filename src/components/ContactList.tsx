
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { List, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/contacts";

interface ContactListProps {
  contacts: Contact[];
  selectedContacts: string[];
  onToggleContact: (contactId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onSendMessages: () => void;
  isSending: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContacts,
  onToggleContact,
  onToggleAll,
  onSendMessages,
  isSending
}) => {
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
  const isSendButtonDisabled = selectedContacts.length === 0 || isSending;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="h-5 w-5 text-whatsapp" />
          Lista de Contatos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b">
          <Checkbox
            id="select-all"
            checked={allSelected}
            onCheckedChange={(checked: boolean) => onToggleAll(checked)}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Selecionar Todos
          </label>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2">
          {contacts.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              Nenhum contato disponível. Carregue contatos do Supabase ou importe um arquivo CSV.
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-0"
              >
                <Checkbox
                  id={`contact-${contact.id}`}
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={(checked: boolean) =>
                    onToggleContact(contact.id, checked)
                  }
                />
                <div className="grid gap-1">
                  <label
                    htmlFor={`contact-${contact.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {contact.name}
                  </label>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão de envio */}
        <div className="pt-4">
          <Button
            onClick={onSendMessages}
            disabled={isSendButtonDisabled}
            className="w-full bg-whatsapp hover:bg-green-600"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagens ({selectedContacts.length})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactList;
