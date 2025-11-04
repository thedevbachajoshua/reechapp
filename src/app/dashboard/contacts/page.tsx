'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContactsTable } from '@/components/contacts/contacts-table';
import { AddContactForm, NewContact } from '@/components/contacts/add-contact-form';
import { contacts as initialContacts, Contact } from '@/lib/data';

export default function ContactsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [contacts, setContacts] = React.useState<Contact[]>(initialContacts);

  const handleAddContact = (newContact: NewContact) => {
    const contactToAdd: Contact = {
      ...newContact,
      id: Math.max(...contacts.map(c => c.id), 0) + 1, // simple id generation
      status: 'New',
      dateAdded: new Date().toISOString().split('T')[0], // a YYYY-MM-DD string
    };
    setContacts(prevContacts => [contactToAdd, ...prevContacts]);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Contacts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add a new believer to your follow-up list.
              </DialogDescription>
            </DialogHeader>
            <AddContactForm 
              onContactAdd={handleAddContact}
              onFinished={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      <ContactsTable contacts={contacts} setContacts={setContacts} />
    </div>
  );
}
