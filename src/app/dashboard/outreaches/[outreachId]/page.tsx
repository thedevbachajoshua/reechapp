'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { Calendar, HeartHandshake, MapPin, Users, Clock, PlusCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/layout/header';
import type { UserProfile } from '@/lib/data';
import { outreachEvents, leaderboard } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserContext } from '@/context/user-context';
import { CreateOutreachForm } from '@/components/outreach/create-outreach-form';

export type OutreachEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: 'Planned' | 'Ongoing' | 'Completed';
  participantIds: string[];
  coordinatorId: string;
  newConverts?: NewConvert[];
};

export type NewConvert = {
  id: string;
  name: string;
  phone: string;
  status: 'Just Met' | 'Contacted' | 'Follow-up Scheduled';
  assignedTo: string;
  notes: string;
};

const OutreachParticipants = ({ participantIds }: { participantIds: string[] }) => {
    const [participants, setParticipants] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching participants
        const fetchedParticipants = leaderboard.filter(u => participantIds.includes(u.uid));
        setParticipants(fetchedParticipants);
        setIsLoading(false);
    }, [participantIds]);

    if (isLoading) return <Skeleton className="h-10 w-full" />;

    return (
        <div className="flex flex-wrap gap-4">
            {participants?.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                    <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={p.avatar} data-ai-hint="person face" />
                        <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{p.name}</span>
                </div>
            ))}
        </div>
    );
};

const AssignedReacher = ({ reacherId }: { reacherId: string }) => {
    const [reacher, setReacher] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const foundReacher = leaderboard.find(u => u.uid === reacherId);
        setReacher(foundReacher || null);
        setIsLoading(false);
    }, [reacherId]);

    if (isLoading) return <Skeleton className="h-5 w-24" />;
    if (!reacher) return <span className="text-sm text-muted-foreground">Unassigned</span>;

    return <span className="text-sm">{reacher?.name}</span>;
}

const addConvertSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'A valid phone number is required'),
  notes: z.string().optional(),
});

const AddNewConvertForm = ({ outreachId, onFinished }: { outreachId: string, onFinished: (newConvert: NewConvert) => void }) => {
    const { toast } = useToast();
    const { userProfile } = useUserContext();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof addConvertSchema>>({
        resolver: zodResolver(addConvertSchema),
        defaultValues: { name: '', phone: '', notes: '' }
    });

    const onSubmit = (values: z.infer<typeof addConvertSchema>) => {
        if (!userProfile) return;
        setIsSubmitting(true);

        const newConvertData: NewConvert = {
            id: `nc_${Date.now()}`,
            ...values,
            status: 'Just Met',
            assignedTo: userProfile.uid,
        };

        setTimeout(() => {
            toast({ title: "New Convert Added", description: `${values.name} has been recorded.` });
            onFinished(newConvertData);
            form.reset();
            setIsSubmitting(false);
        }, 500);
    }

    return (
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="555-123-4567" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Initial conversation details..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Convert
                    </Button>
                </div>
            </form>
         </Form>
    )
}

export default function OutreachDetailPage() {
  const params = useParams();
  const { outreachId } = params as { outreachId: string };
  const [event, setEvent] = React.useState<OutreachEvent | null | undefined>(undefined);
  const [newConverts, setNewConverts] = React.useState<NewConvert[]>([]);
  const [isAddConvertOpen, setIsAddConvertOpen] = React.useState(false);

  React.useEffect(() => {
    // Simulate fetching data
    const foundEvent = outreachEvents.find(e => String(e.id) === outreachId);
    setEvent(foundEvent);
    setNewConverts(foundEvent?.newConverts || []);
  }, [outreachId]);

  const handleNewConvertAdded = (newConvert: NewConvert) => {
    setNewConverts(prev => [...prev, newConvert]);
    setIsAddConvertOpen(false);
  };
  
  if (event === undefined) {
    return (
      <div className="space-y-6">
        <Header pageTitle="Loading..." />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48 lg:col-span-2" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <Header pageTitle="Not Found" />
        <div className="flex flex-col items-center justify-center text-center py-12">
          <h1 className="text-2xl font-bold">Outreach Not Found</h1>
          <p className="text-muted-foreground">The outreach event you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/outreaches">Back to Outreaches</Link>
          </Button>
        </div>
      </>
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
       <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold font-headline">{event.title}</h1>
              <p className="text-muted-foreground flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
              </p>
            </div>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Users className="h-5 w-5" /> Reachers</span>
              <span className="font-bold">{event.participantIds.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><HeartHandshake className="h-5 w-5" /> New Converts</span>
              <span className="font-bold">{newConverts.length}</span>
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
                <OutreachParticipants participantIds={event.participantIds} />
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>New Converts</CardTitle>
            <CardDescription>
              Individuals who have accepted Christ during this event.
            </CardDescription>
          </div>
           <Dialog open={isAddConvertOpen} onOpenChange={setIsAddConvertOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Convert
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Convert</DialogTitle>
                  <DialogDescription>
                    Record a new believer met during this outreach.
                  </DialogDescription>
                </DialogHeader>
                <AddNewConvertForm 
                    outreachId={String(outreachId)} 
                    onFinished={handleNewConvertAdded}
                />
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            {newConverts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    <p>No new converts have been recorded for this outreach yet.</p>
                </div>
            ) : (
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
                            {newConverts?.map((convert) => (
                                <TableRow key={convert.id}>
                                    <TableCell className="font-medium">{convert.name}</TableCell>
                                    <TableCell>{convert.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariantMap[convert.status]} className={convert.status === 'Just Met' ? 'bg-accent text-accent-foreground' : ''}>
                                            {convert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <AssignedReacher reacherId={convert.assignedTo} />
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{convert.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
