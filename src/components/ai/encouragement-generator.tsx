'use client';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePersonalizedEncouragement } from '@/ai/flows/generate-personalized-encouragement';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  userProfile: z.string().min(10, { message: 'Please provide more details about the user.' }),
  conversationHistory: z.string().optional(),
});

type Encouragement = {
  encouragement: string;
  scriptureReference: string;
};

export function EncouragementGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<Encouragement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      conversationHistory: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const encouragement = await generatePersonalizedEncouragement({
          userProfile: values.userProfile,
          conversationHistory: values.conversationHistory || 'No recent conversation.',
        });
        setResult(encouragement);
      } catch (e) {
        setError('Failed to generate encouragement. Please try again.');
        console.error(e);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Context</CardTitle>
              <CardDescription>
                Provide context about the person and the conversation to generate a personalized message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="userProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Profile & Needs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'New believer, struggling with feelings of doubt and loneliness...'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conversationHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Conversation (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'User mentioned they missed church last Sunday...'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isPending ? 'Generating...' : 'Generate Encouragement'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Encouragement</CardTitle>
          <CardDescription>
            Use this message and scripture as a starting point for your conversation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          )}
          {error && <p className="text-destructive text-center">{error}</p>}
          {!isPending && !result && !error && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
              <Sparkles className="h-12 w-12 mb-4" />
              <p>Your generated message will appear here.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6 animate-in fade-in-50">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Personalized Message
                </h3>
                <blockquote className="border-l-2 border-primary pl-4 text-foreground/90 leading-relaxed italic">
                  {result.encouragement}
                </blockquote>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Suggested Scripture
                </h3>
                <p className="font-medium text-accent-foreground">
                  {result.scriptureReference}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
