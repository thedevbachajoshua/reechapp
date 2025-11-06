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
import { addDoc, collection, Timestamp, query, where } from 'firebase/firestore';
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
import { Contact } from '@/app/dashboard/contacts/page';


const formSchema = z.object({
  contact: z.object({
      id: z.string(),
      name: z.string(),
      photoURL: z.string().optional(),
      phone: z.string(),
    }).nullable().refine(val => val !== null, { message: 'You must select a contact.' }),
  message: z.string().min(10, { message: 'Message is too short.' }),
  scheduledForDate: z.date({ required_error: 'A date is required.' }),
  scheduledForTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format (HH:MM)"})
});

type ScheduleFollowUpFormProps = {
  onFinished: () => void;
};


export function ScheduleFollowUpForm({
  onFinished,
}: ScheduleFollowUpFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'contacts'), where('ownerId', '==', user.uid));
  }, [firestore, user]);

  const { data: contacts, isLoading: isLoadingContacts } = useCollection<Contact>(contactsQuery);

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
      contactAvatar: `https://picsum.photos/seed/${values.contact.id}/40/40`,
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
                    <CommandEmpty>
                        {isLoadingContacts ? 'Loading contacts...' : 'No contacts found.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {contacts?.map(c => (
                        <CommandItem
                          value={c.name}
                          key={c.id}
                          onSelect={() => {
                            form.setValue('contact', {
                                id: c.id,
                                name: c.name,
                                phone: c.phone,
                                photoURL: `https://picsum.photos/seed/${c.id}/40/40`
                            });
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
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
