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
import { collection, query, where, addDoc, doc, setDoc } from 'firebase/firestore';

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
  const { user } = useUserContext();
  const firestore = useFirestore();

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: contacts, isLoading, setData: setContacts } = useCollection<Contact>(contactsQuery);

  const handleOpenEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
  };

  const handleSaveContact = async (contactData: NewContact, contactId?: string) => {
    if (!firestore || !user) return;
    
    if (contactId) { // Editing existing contact
      const contactRef = doc(firestore, 'contacts', contactId);
      const updatedData = {
        ...contactData,
      };
      setDoc(contactRef, updatedData, { merge: true })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: contactRef.path,
                operation: 'update',
                requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    } else { // Adding new contact
       const contactToAdd = {
        ...contactData,
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
