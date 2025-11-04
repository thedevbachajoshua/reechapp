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
import { contacts as initialContacts, Contact } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statuses = ['New', 'Contacted', 'In Progress', 'Follow-up'];

const statusVariantMap: {
  [key: string]: 'default' | 'secondary' | 'outline' | 'destructive';
} = {
  New: 'default',
  Contacted: 'secondary',
  'In Progress': 'outline',
  'Follow-up': 'destructive', // Example for another status
};

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const { toast } = useToast();

  const handleStatusChange = (contactId: number, newStatus: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId ? { ...contact, status: newStatus } : contact
      )
    );
    toast({
      title: 'Status Updated',
      description: `Contact status changed to ${newStatus}.`,
    });
  };

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
                      className="flex items-center gap-2"
                    >
                      <Badge
                        variant={statusVariantMap[contact.status]}
                        className={
                          contact.status === 'New'
                            ? 'bg-accent text-accent-foreground'
                            : ''
                        }
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
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {contact.dateAdded}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
