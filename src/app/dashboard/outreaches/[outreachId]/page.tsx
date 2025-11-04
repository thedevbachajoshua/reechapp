'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { outreachEvents } from '@/lib/data';
import { useParams } from 'next/navigation';
import { Calendar, HeartHandshake, MapPin, Users, Check, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/layout/header';

export default function OutreachDetailPage() {
  const params = useParams();
  const { outreachId } = params;

  const event = outreachEvents.find((e) => e.id.toString() === outreachId);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <h1 className="text-2xl font-bold">Outreach Not Found</h1>
        <p className="text-muted-foreground">The outreach event you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/outreaches">Back to Outreaches</Link>
        </Button>
      </div>
    )
  }
  
  const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' } = {
    'Just Met': 'default',
    Contacted: 'secondary',
    'Follow-up Scheduled': 'outline',
  };


  return (
    <>
    <Header pageTitle={event.title} />
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold font-headline">{event.title}</h1>
          <p className="text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Users className="h-5 w-5" /> Reachers</span>
              <span className="font-bold">{event.participants.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><HeartHandshake className="h-5 w-5" /> New Converts</span>
              <span className="font-bold">{event.newConverts.length}</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-5 w-5" /> Status</span>
              <Badge variant={event.status === 'Ongoing' ? 'default' : 'secondary'} className={event.status === 'Ongoing' ? 'bg-primary' : ''}>
                {event.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
                <CardDescription>Team members involved in this outreach.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-wrap gap-4">
                    {event.participants.map((p) => (
                      <div key={p.name} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={p.avatar} data-ai-hint="person face"/>
                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{p.name}</span>
                      </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>New Converts</CardTitle>
          <CardDescription>
            Individuals who have accepted Christ during this event.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {event.newConverts.length > 0 ? (
                 <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {event.newConverts.map((convert, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{convert.name}</TableCell>
                                    <TableCell>{convert.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariantMap[convert.status]} className={convert.status === 'Just Met' ? 'bg-accent text-accent-foreground' : ''}>
                                            {convert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{convert.assignedTo}</TableCell>
                                    <TableCell className="text-muted-foreground">{convert.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No new converts have been recorded for this outreach yet.</p>
                </div>
            )}
        </CardContent>
      </Card>

    </div>
    </>
  );
}
