import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { List } from "lucide-react";
import { Contact } from "@/types/contacts";

interface ContactListProps {
  contacts: Contact[];
  selectedContacts: string[];
  onToggleContact: (contactId: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContacts,
  onToggleContact,
  onToggleAll,
}) => {
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;

  if (contacts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <List className="h-5 w-5 text-whatsapp" />
            Contact List
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          No eligible contacts loaded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-whatsapp" />
            Contact List
          </div>
          <span className="text-sm font-normal text-gray-500">
            {selectedContacts.length} of {contacts.length} selected
          </span>
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
            Select All
          </label>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto pr-2">
          {contacts.map((contact) => (
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
                <p className="text-xs text-gray-500">
                  {contact.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Garantindo apenas uma exportação default
export default ContactList;

