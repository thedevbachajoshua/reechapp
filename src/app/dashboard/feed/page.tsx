import { Button } from '@/components/ui/button';
import { DevotionalCard } from '@/components/feed/devotional-card';
import { devotionalPosts } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function FeedPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Discipleship Feed</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {devotionalPosts.map((post) => (
          <DevotionalCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
