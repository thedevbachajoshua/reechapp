'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { followUps as initialFollowUps } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Bot, Send } from 'lucide-react';
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
import { sendFollowUpMessage } from '@/ai/flows/send-follow-up';
import { Skeleton } from '@/components/ui/skeleton';

type FollowUp = typeof initialFollowUps[0];

const AiFollowUpGenerator = ({ followUp, onFinished }: { followUp: FollowUp, onFinished: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        setGeneratedMessage('');
        try {
            const result = await sendFollowUpMessage({
                contactName: followUp.contactName,
                contactDetails: 'A new believer met at the event.', // Placeholder details
                outreachTitle: 'a recent outreach event' // Placeholder title
            });
            setGeneratedMessage(result.message);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not generate AI message.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        toast({
            title: 'Message Sent (Simulated)',
            description: 'In a real app, this would send an SMS or WhatsApp message.'
        });
        onFinished();
    };

    return (
        <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-semibold">Context</p>
                <p className="text-sm text-muted-foreground">
                    To: {followUp.contactName}
                </p>
            </div>
            
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? 'Generating...' : <><Bot className="mr-2 h-4 w-4" /> Generate with AI</>}
            </Button>
            
            {generatedMessage && (
                <div className="space-y-2 animate-in fade-in-50">
                    <p className="text-sm font-medium">Generated Message:</p>
                    <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                        {generatedMessage}
                    </blockquote>
                </div>
            )}

            <div className="flex justify-end pt-4">
                 <Button onClick={handleSend} disabled={!generatedMessage}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                 </Button>
            </div>
        </div>
    )
}

export default function FollowUpsPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState<false | number>(false);
    const [followUps] = useState(initialFollowUps);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Scheduled Follow-ups</h1>
        <p className="text-muted-foreground">Manage and automate your follow-up messages.</p>
      </div>

      <Dialog open={typeof isDialogOpen === 'number'} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Automated Follow-up</DialogTitle>
                <DialogDescription>
                    Generate a personalized message with AI and send it.
                </DialogDescription>
            </DialogHeader>
            {typeof isDialogOpen === 'number' && (
                <AiFollowUpGenerator 
                    followUp={followUps.find(f => f.id === isDialogOpen)!} 
                    onFinished={() => setIsDialogOpen(false)}
                />
            )}
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {followUps.map((followUp) => (
          <Card key={followUp.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{followUp.contactName}</CardTitle>
                  <CardDescription>{followUp.scheduledFor}</CardDescription>
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={followUp.contactAvatar} data-ai-hint="person face" />
                  <AvatarFallback>{followUp.contactName.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                "{followUp.message}"
              </p>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={followUp.status === 'Sent' ? 'secondary' : 'default'}
                  className={followUp.status === 'Scheduled' ? 'bg-accent text-accent-foreground' : ''}
                >
                  {followUp.status === 'Scheduled' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                  {followUp.status}
                </Badge>
                {followUp.status === 'Scheduled' && (
                    <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(followUp.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Now
                    </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
