'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
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
import { useUserContext } from '@/context/user-context';
import { contacts as initialContacts, UserProfile } from '@/lib/data';

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: string;
  dateAdded: string;
  ownerId: string;
};

export default function ContactsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);
  const [contacts, setContacts] = React.useState<Contact[]>(initialContacts.map(c => ({...c, id: String(c.id)})));
  const { userProfile } = useUserContext();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      if (userProfile) {
        setContacts(initialContacts.map(c => ({...c, id: String(c.id), ownerId: userProfile.uid })));
      }
      setIsLoading(false);
    }, 500);
  }, [userProfile]);

  const handleOpenEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
  };

  const handleSaveContact = (contactData: NewContact, contactId?: string) => {
    if (!userProfile) return;
    
    if (contactId) { // Editing existing contact
      setContacts(prevContacts => prevContacts.map(c => c.id === contactId ? { ...c, ...contactData } : c));
    } else { // Adding new contact
       const newContact: Contact = {
        id: (contacts.length + 1).toString(),
        ...contactData,
        status: 'New',
        dateAdded: new Date().toISOString(),
        ownerId: userProfile.uid,
      };
      setContacts(prevContacts => [newContact, ...prevContacts]);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Contacts</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseDialog();
            else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingContact(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
              <DialogDescription>
                {editingContact ? 'Update the details for this contact.' : 'Add a new believer to your follow-up list.'}
              </DialogDescription>
            </DialogHeader>
            <AddContactForm 
              onSave={handleSaveContact}
              onFinished={handleCloseDialog} 
              initialData={editingContact}
            />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ContactsTable 
            contacts={contacts || []} 
            setContacts={setContacts}
            onEdit={handleOpenEditDialog}
        />
      )}
    </div>
  );
}
