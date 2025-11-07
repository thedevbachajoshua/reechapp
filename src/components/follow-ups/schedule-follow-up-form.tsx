'use client';

import React, { useState, useEffect } from 'react';
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
import { format, parse } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useMemoFirebase, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { addDoc, collection, Timestamp, query, where, doc, updateDoc } from 'firebase/firestore';
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
import { FollowUp } from '@/app/dashboard/follow-ups/page';


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
  initialData?: FollowUp | null;
};


export function ScheduleFollowUpForm({
  onFinished,
  initialData,
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

  useEffect(() => {
      if (initialData && contacts) {
          const contact = contacts.find(c => c.id === initialData.contactId);
          form.reset({
              contact: contact ? { 
                  id: contact.id, 
                  name: contact.name, 
                  phone: contact.phone,
                  photoURL: `https://picsum.photos/seed/${contact.id}/40/40`
                } : null,
              message: initialData.message,
              scheduledForDate: initialData.scheduledFor.toDate(),
              scheduledForTime: format(initialData.scheduledFor.toDate(), 'HH:mm'),
          });
      } else {
        form.reset({
          contact: null,
          message: '',
          scheduledForDate: undefined,
          scheduledForTime: '09:00',
        });
      }
  }, [initialData, contacts, form]);

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

    const followUpData = {
      contactId: values.contact.id,
      contactName: values.contact.name,
      contactAvatar: `https://picsum.photos/seed/${values.contact.id}/40/40`,
      message: values.message,
      scheduledFor: Timestamp.fromDate(scheduledDateTime),
      status: 'Scheduled',
      creatorId: user.uid,
    };
    
    try {
        if (initialData) {
            // Update existing document
            const followUpRef = doc(firestore, 'scheduled_follow_ups', initialData.id);
            const updateData = {
                ...followUpData,
                status: initialData.status, // Keep original status when editing
            };
            await updateDoc(followUpRef, updateData).catch(err => {
                 const permissionError = new FirestorePermissionError({
                    path: followUpRef.path,
                    operation: 'update',
                    requestResourceData: updateData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
            toast({ title: 'Follow-up Updated!', description: `The scheduled message for ${values.contact.name} has been updated.` });
        } else {
            // Create new document
            const followUpsCollection = collection(firestore, 'scheduled_follow_ups');
            await addDoc(followUpsCollection, followUpData).catch(err => {
                 const permissionError = new FirestorePermissionError({
                    path: followUpsCollection.path,
                    operation: 'create',
                    requestResourceData: followUpData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
            toast({ title: 'Follow-up Scheduled!', description: `A message for ${values.contact.name} is scheduled for ${scheduledDateTime.toLocaleDateString()}.` });
        }
        onFinished();
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the follow-up.' });
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
                      disabled={!!initialData}
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
            {initialData ? 'Save Changes' : 'Schedule Follow-up'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
