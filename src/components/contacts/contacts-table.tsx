import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { contacts } from '@/lib/data';
  
  const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' } = {
    New: 'default',
    Contacted: 'outline',
    'In Progress': 'secondary',
  };
  
  export function ContactsTable() {
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
                <TableCell className="hidden md:table-cell text-muted-foreground">{contact.email}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{contact.phone}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[contact.status]} className={contact.status === 'New' ? 'bg-accent text-accent-foreground' : ''}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{contact.dateAdded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  