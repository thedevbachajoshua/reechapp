'use client';

import { Button } from '@/components/ui/button';
import { DevotionalCard } from '@/components/feed/devotional-card';
import { devotionalPosts as initialPosts } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { useUserContext } from '@/context/user-context';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content is too short."),
});

export default function FeedPage() {
  const { userProfile } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [devotionalPosts, setDevotionalPosts] = useState(initialPosts);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = (values: z.infer<typeof postSchema>) => {
     if (!userProfile) return;

     const newPost = {
        id: devotionalPosts.length + 1,
        title: values.title,
        content: values.content,
        author: userProfile.name || 'Anonymous',
        authorAvatar: userProfile.photoURL,
        image: `https://picsum.photos/seed/devotional${devotionalPosts.length + 1}/600/400`,
        imageHint: 'faith inspiration',
     };

     setDevotionalPosts([newPost, ...devotionalPosts]);
     toast({
        title: "Post Created",
        description: "Your devotional has been added to the feed.",
     });
     setIsDialogOpen(false);
     form.reset();
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Discipleship Feed</h1>
        {userProfile?.role && ['Supervisor', 'Reacher'].includes(userProfile.role) && (
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Devotional Post</DialogTitle>
                  <DialogDescription>Share an encouraging message with the community.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input placeholder="e.g., The Power of Prayer" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl><Textarea placeholder="Share your thoughts..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Post</Button>
                  </form>
                </Form>
              </DialogContent>
           </Dialog>
        )}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {devotionalPosts.map((post) => (
          <DevotionalCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
