'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useUserContext } from '@/context/user-context';
import { UserProfile, leaderboard } from '@/lib/data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Badge } from '../ui/badge';
import type { OutreachEvent } from '@/app/dashboard/outreaches/[outreachId]/page';


const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description is too short.' }),
  location: z.string().min(3, { message: 'Location is required.' }),
  date: z.date({ required_error: 'A date is required.' }),
  participantIds: z.array(z.string()).min(1, { message: 'You must select at least one participant.' }),
});

type CreateOutreachFormProps = {
  onFinished: (event: OutreachEvent) => void;
  outreachToEdit?: OutreachEvent | null;
};

export function CreateOutreachForm({ onFinished, outreachToEdit }: CreateOutreachFormProps) {
  const { toast } = useToast();
  const { userProfile } = useUserContext();
  const [isSaving, setIsSaving] = React.useState(false);

  const reachers = leaderboard.filter(u => String(u.id) !== userProfile?.uid); // Mock reachers

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: outreachToEdit 
      ? { ...outreachToEdit, date: new Date(outreachToEdit.date) }
      : {
          title: '',
          description: '',
          location: '',
          participantIds: userProfile?.role === 'Supervisor' ? [userProfile!.uid] : [],
        },
  });

  useEffect(() => {
    if (outreachToEdit) {
      form.reset({
        ...outreachToEdit,
        date: new Date(outreachToEdit.date),
      });
    }
  }, [outreachToEdit, form]);
  
  const selectedParticipantIds = form.watch('participantIds') || [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userProfile) return;
    setIsSaving(true);
    
    // Simulate network request
    setTimeout(() => {
        if (outreachToEdit) {
            const updatedEvent: OutreachEvent = {
                ...outreachToEdit,
                ...values,
                date: values.date.toISOString(),
            };
            onFinished(updatedEvent);
            toast({ title: "Outreach Updated!", description: `${values.title} has been updated.` });

        } else {
            const finalParticipantIds = [...new Set([...values.participantIds, userProfile.uid])];
            const newOutreach: OutreachEvent = {
                id: Date.now(), // simple unique id for demo
                ...values,
                date: values.date.toISOString(),
                coordinatorId: userProfile.uid,
                participantIds: finalParticipantIds,
                status: 'Planned',
                newConverts: [],
            };
            onFinished(newOutreach);
            toast({ title: "Outreach Created!", description: `${values.title} has been scheduled.` });
        }
        setIsSaving(false);
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outreach Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Downtown Hope Initiative" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the main goals and activities of this outreach."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Central Park" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="date"
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
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="participantIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assign Reachers</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between h-auto min-h-10",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                       <div className="flex gap-1 flex-wrap">
                        {leaderboard
                          ?.filter(r => selectedParticipantIds.includes(String(r.id)))
                          .map(r => <Badge variant="secondary" key={r.id}>{r.name}</Badge>)
                        }
                        {selectedParticipantIds.length === 0 && 'Select Reachers...'}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search reachers..." />
                    <CommandEmpty>No reachers found.</CommandEmpty>
                    <CommandGroup>
                      {reachers?.map((reacher) => (
                        <CommandItem
                          value={reacher.name}
                          key={reacher.id}
                          onSelect={() => {
                            const currentIds = field.value || [];
                            const newIds = currentIds.includes(String(reacher.id))
                              ? currentIds.filter((id) => id !== String(reacher.id))
                              : [...currentIds, String(reacher.id)];
                            field.onChange(newIds);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(String(reacher.id))
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {reacher.name}
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
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {outreachToEdit ? 'Save Changes' : 'Create Outreach'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
