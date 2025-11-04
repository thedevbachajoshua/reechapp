'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Bot, Send, PlusCircle, Loader2 } from 'lucide-react';
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { ScheduleFollowUpForm } from '@/components/follow-ups/schedule-follow-up-form';

export type FollowUp = {
  id: string;
  contactName: string;
  contactId: string;
  contactAvatar: string;
  scheduledFor: Timestamp;
  message: string;
  status: 'Scheduled' | 'Sent' | 'Failed';
};

export default function FollowUpsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const firestore = useFirestore();

  const followUpsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'scheduled_follow_ups'), orderBy('scheduledFor', 'desc'));
  }, [firestore]);

  const { data: followUps, isLoading } = useCollection<FollowUp>(followUpsQuery);

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Follow-up</DialogTitle>
              <DialogDescription>
                Select a contact, compose your message, and set a date and time for it to be sent.
              </DialogDescription>
            </DialogHeader>
            <ScheduleFollowUpForm onFinished={() => setIsDialogOpen(false)} />
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
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={followUp.contactAvatar}
                      data-ai-hint="person face"
                    />
                    <AvatarFallback>
                      {followUp.contactName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <blockquote className="text-sm text-muted-foreground border-l-2 pl-3 italic line-clamp-3 mb-4">
                  {followUp.message}
                </blockquote>
                <div className="flex items-center justify-between">
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
                  {/* In a real app, a sent message could be viewed, and a failed one could be retried */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
