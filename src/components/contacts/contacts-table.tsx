'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Trash2, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Dispatch, SetStateAction } from 'react';
import { Contact } from '@/app/dashboard/contacts/page';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const statuses = ['New', 'Contacted', 'In Progress', 'Follow-up'];

type Status = 'New' | 'Contacted' | 'In Progress' | 'Follow-up';

const statusConfig: Record<Status, { variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'contacted' | 'inProgress' }> = {
  'New': { variant: 'default' },
  'Contacted': { variant: 'contacted' },
  'In Progress': { variant: 'inProgress' },
  'Follow-up': { variant: 'destructive' },
};

type ContactsTableProps = {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[] | null>>;
  onEdit: (contact: Contact) => void;
}

export function ContactsTable({ contacts, setContacts, onEdit }: ContactsTableProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleStatusChange = (contactId: string, newStatus: string) => {
    if (!firestore) return;
    const contactRef = doc(firestore, 'contacts', contactId);
    const updateData = { status: newStatus };
    updateDoc(contactRef, updateData)
      .then(() => {
        toast({
          title: 'Status Updated',
          description: `Contact status changed to ${newStatus}.`,
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contactRef.path,
            operation: 'update',
            requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };
  
  const handleDelete = (contactId: string) => {
    if(!firestore) return;
    const contactRef = doc(firestore, 'contacts', contactId);
    deleteDoc(contactRef)
      .then(() => {
        toast({
          title: 'Contact Deleted',
          description: 'The contact has been removed.',
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: contactRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {contact.email}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {contact.phone}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 hover:bg-transparent"
                    >
                      <Badge
                        variant={statusConfig[contact.status as Status]?.variant ?? 'default'}
                        className={cn('capitalize cursor-pointer', {
                          'bg-accent text-accent-foreground': contact.status === 'New',
                        })}
                      >
                        {contact.status}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {statuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() => handleStatusChange(contact.id, status)}
                        disabled={contact.status === status}
                      >
                        <Badge
                           variant={statusConfig[status as Status]?.variant ?? 'default'}
                           className={cn('w-full', {
                            'bg-accent text-accent-foreground': status === 'New',
                          })}
                        >
                          {status}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {new Date(contact.dateAdded).toLocaleDateString()}
              </TableCell>
               <TableCell className="text-right space-x-1">
                 <Button variant="ghost" size="icon" onClick={() => onEdit(contact)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                    <Trash2 className="h-4 w-4 text-destructive/70" />
                    <span className="sr-only">Delete</span>
                </Button>
               </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
