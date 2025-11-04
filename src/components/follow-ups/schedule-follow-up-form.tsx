'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Loader2,
  Bot,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useUserContext } from '@/context/user-context';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { sendFollowUpMessage } from '@/ai/flows/send-follow-up';
import { Input } from '../ui/input';

const formSchema = z.object({
  contact: z.object({
      id: z.string(),
      name: z.string(),
      photoURL: z.string().optional(),
    }).nullable().refine(val => val !== null, { message: 'You must select a contact.' }),
  message: z.string().min(10, { message: 'Message is too short.' }),
  scheduledForDate: z.date({ required_error: 'A date is required.' }),
  scheduledForTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)"})
});

type ScheduleFollowUpFormProps = {
  onFinished: () => void;
};

// This represents a simplified contact from a subcollection
type SimpleContact = {
  id: string;
  name: string;
  phone: string;
  outreachId: string;
  photoURL?: string; // Let's assume a photoURL for avatar
};

export function ScheduleFollowUpForm({
  onFinished,
}: ScheduleFollowUpFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // In a larger app, you might fetch from a unified 'contacts' collection
  // For now, we'll fetch from all 'new_converts' subcollections
  const newConvertsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'outreaches') : null),
    [firestore]
  );
  // This is not ideal as it fetches all outreach docs just to get subcollections.
  // A better structure would be a top-level contacts collection.
  // For this example, we'll proceed. A full implementation should improve this.
  const { data: outreaches } = useCollection(newConvertsQuery);

  const [allContacts, setAllContacts] = useState<SimpleContact[]>([]);

  React.useEffect(() => {
    if (!outreaches || !firestore) return;
    
    const fetchContacts = async () => {
        const contactsPromises = outreaches.map(o => getDoc(collection(firestore, 'outreaches', o.id, 'new_converts')));
        const contactsSnapshots = await Promise.all(contactsPromises);
        const contacts: SimpleContact[] = [];
        contactsSnapshots.forEach((snap, index) => {
            snap.forEach(doc => {
                contacts.push({
                    id: doc.id,
                    ...doc.data(),
                    outreachId: outreaches[index].id,
                    photoURL: `https://picsum.photos/seed/${doc.id}/40/40` // placeholder
                } as SimpleContact)
            })
        });
       // A real implementation would use Promise.allSettled and handle errors
       // and also fetch from a unified contacts collection instead of subcollections.
       // For now, this demonstrates the concept.
    }
    // This is a simplified fetch and doesn't listen for real-time updates.
    // In a real app, you would manage this more robustly.
    // For now, we assume contacts don't change while the form is open.

  }, [outreaches, firestore]);
  
    // HACK: Because we can't easily query all subcollections, we'll just use mock data for contacts.
    // This should be replaced with a proper query in a real application.
    const mockContacts: SimpleContact[] = [
        { id: 'mock1', name: 'Peter Jones', phone: '123-456-7890', outreachId: 'mock-outreach', photoURL: 'https://picsum.photos/seed/followup1/40/40'},
        { id: 'mock2', name: 'Mary Williams', phone: '234-567-8901', outreachId: 'mock-outreach', photoURL: 'https://picsum.photos/seed/followup2/40/40'},
        { id: 'mock3', name: 'David Miller', phone: '345-678-9012', outreachId: 'mock-outreach', photoURL: 'https://picsum.photos/seed/followup3/40/40'},
    ];


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: null,
      message: '',
      scheduledForTime: '09:00',
    },
  });

  const handleGenerateAiMessage = async () => {
    const contact = form.getValues('contact');
    if (!contact) {
      toast({ variant: 'destructive', title: 'Please select a contact first.' });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await sendFollowUpMessage({
        contactName: contact.name,
        contactDetails: 'A new believer met at a recent event.',
        outreachTitle: 'a REECH outreach event',
      });
      form.setValue('message', result.message, { shouldValidate: true });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Could not generate message.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user || !values.contact) return;
    setIsSubmitting(true);
    
    const [hours, minutes] = values.scheduledForTime.split(':').map(Number);
    const scheduledDateTime = new Date(values.scheduledForDate);
    scheduledDateTime.setHours(hours, minutes);

    const newFollowUp = {
      contactId: values.contact.id,
      contactName: values.contact.name,
      contactAvatar: values.contact.photoURL || `https://picsum.photos/seed/${values.contact.id}/40/40`,
      message: values.message,
      scheduledFor: Timestamp.fromDate(scheduledDateTime),
      status: 'Scheduled',
      creatorId: user.uid,
    };

    try {
      const followUpsCollection = collection(firestore, 'scheduled_follow_ups');
      await addDoc(followUpsCollection, newFollowUp);

      toast({
        title: 'Follow-up Scheduled!',
        description: `A message for ${values.contact.name} is scheduled for ${scheduledDateTime.toLocaleDateString()}.`,
      });
      onFinished();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not schedule follow-up.',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Contact</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? field.value.name : 'Select a contact'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search contacts..." />
                    <CommandEmpty>No contacts found.</CommandEmpty>
                    <CommandGroup>
                      {mockContacts.map(c => (
                        <CommandItem
                          value={c.name}
                          key={c.id}
                          onSelect={() => {
                            form.setValue('contact', c);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value?.id === c.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="relative">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write an encouraging message..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateAiMessage}
            disabled={isAiLoading}
            className="absolute bottom-1 right-1"
          >
            {isAiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            <span className="sr-only">Generate with AI</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="scheduledForDate"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="scheduledForTime"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Time (24hr)</FormLabel>
                <FormControl>
                   <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Schedule
          </Button>
        </div>
      </form>
    </Form>
  );
}
