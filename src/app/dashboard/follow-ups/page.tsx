'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Send, PlusCircle, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  doc,
  updateDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { ScheduleFollowUpForm } from '@/components/follow-ups/schedule-follow-up-form';
import { useUserContext } from '@/context/user-context';
import { Contact } from '@/app/dashboard/contacts/page';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { sendFollowUpMessage } from '@/ai/flows/send-follow-up';


export type FollowUp = {
  id: string;
  contactName: string;
  contactId: string;
  contactAvatar: string;
  scheduledFor: Timestamp;
  message: string;
  status: 'Scheduled' | 'Sent' | 'Failed';
  creatorId: string;
};

export default function FollowUpsPage() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user } = useUserContext();

  const followUpsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'scheduled_follow_ups'), 
      where('creatorId', '==', user.uid), 
      orderBy('scheduledFor', 'desc')
    );
  }, [firestore, user]);

  const { data: followUps, isLoading } = useCollection<FollowUp>(followUpsQuery);

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: contacts } = useCollection<Contact>(contactsQuery);
  
  const handleOpenEditDialog = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setEditingFollowUp(null);
    setIsFormDialogOpen(false);
  };
  
  const handleDelete = (followUpId: string) => {
      if (!firestore) return;
      const followUpRef = doc(firestore, 'scheduled_follow_ups', followUpId);
      deleteDoc(followUpRef)
        .then(() => {
            toast({ title: "Follow-up Deleted", description: "The scheduled message has been removed." });
        })
        .catch((error) => {
            const permissionError = new FirestorePermissionError({
                path: followUpRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const handleSendNow = async (followUp: FollowUp) => {
    if (!firestore || !contacts) return;
    setSendingId(followUp.id);
  
    const contact = contacts.find(c => c.id === followUp.contactId);
  
    try {
      // For the MVP, we just mark it as sent without calling an external API.
      const result = await sendFollowUpMessage({
        contactName: followUp.contactName,
        contactDetails: contact?.phone || 'No details', // Pass phone or some detail
        outreachTitle: "a REECH outreach event" // Placeholder
      });

      if (result.status.startsWith('Failed')) {
        throw new Error(result.status);
      }
      
      const followUpRef = doc(firestore, 'scheduled_follow_ups', followUp.id);
      const updateData = { status: 'Sent' };
      
      await updateDoc(followUpRef, updateData).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: followUpRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
      });

      toast({
        title: 'Message "Sent"!',
        description: 'The follow-up has been marked as sent for this MVP.',
      });

    } catch (error) {
      console.error('Error sending follow-up now:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: (error as Error).message || 'An unexpected error occurred.',
      });
    } finally {
      setSendingId(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            Scheduled Follow-ups
          </h1>
          <p className="text-muted-foreground">
            Manage and automate your follow-up messages.
          </p>
        </div>
        <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) handleCloseFormDialog();
            else setIsFormDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>{editingFollowUp ? 'Edit Follow-up' : 'Schedule a New Follow-up'}</DialogTitle>
              <DialogDescription>
                {editingFollowUp ? 'Update the details for this scheduled message.' : 'Select a contact, compose your message, and set a date and time.'}
              </DialogDescription>
            </DialogHeader>
            <ScheduleFollowUpForm onFinished={handleCloseFormDialog} initialData={editingFollowUp} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" /></div>}

      {!isLoading && (!followUps || followUps.length === 0) ? (
        <div className="text-center text-muted-foreground py-16">
            <Clock className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">No Follow-ups Scheduled</h3>
            <p>Click "Schedule Follow-up" to send a message later.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {followUps?.map(followUp => (
            <Card key={followUp.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {followUp.contactName}
                    </CardTitle>
                    <CardDescription>
                      {followUp.scheduledFor.toDate().toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </CardDescription>
                  </div>
                   <div className="flex items-center">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage
                        src={followUp.contactAvatar}
                        data-ai-hint="person face"
                        />
                        <AvatarFallback>
                        {followUp.contactName.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                     {followUp.status === 'Scheduled' && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(followUp)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the scheduled follow-up.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(followUp.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                   </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <blockquote className="text-sm text-muted-foreground border-l-2 pl-3 italic line-clamp-3 mb-4">
                  {followUp.message}
                </blockquote>
                <div className="flex items-center">
                  <Badge
                    variant={followUp.status === 'Sent' ? 'secondary' : 'default'}
                    className={
                      followUp.status === 'Scheduled'
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    }
                  >
                    {followUp.status === 'Scheduled' ? (
                      <Clock className="mr-1 h-3 w-3" />
                    ) : (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {followUp.status}
                  </Badge>
                </div>
              </CardContent>
               {followUp.status === 'Scheduled' && (
                <CardFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSendNow(followUp)}
                        disabled={sendingId === followUp.id}
                    >
                      {sendingId === followUp.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                        {sendingId === followUp.id ? 'Sending...' : 'Send Now'}
                    </Button>
                </CardFooter>
               )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
