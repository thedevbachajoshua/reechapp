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
import { useFirestore, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  dateAdded: string;
  ownerId: string;
};

export default function ContactsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { user } = useUserContext();
  const firestore = useFirestore();

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: contacts, isLoading, setData: setContacts } = useCollection<Contact>(contactsQuery);

  const handleAddContact = async (newContact: NewContact) => {
    if (!firestore || !user) return;
    
    const contactToAdd = {
      ...newContact,
      status: 'New',
      dateAdded: new Date().toISOString(),
      ownerId: user.uid,
    };
    
    const contactsCollection = collection(firestore, 'contacts');
    addDoc(contactsCollection, contactToAdd)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: contactsCollection.path,
                operation: 'create',
                requestResourceData: contactToAdd,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ContactsTable contacts={contacts || []} setContacts={setContacts} />
      )}
    </div>
  );
}
