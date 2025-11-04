
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

type Post = {
    id: number;
    title: string;
    author: string;
    authorAvatar?: string;
    image: string;
    imageHint: string;
    content: string;
};
  
export function DevotionalCard({ post }: { post: Post }) {
    const authorAvatar = post.authorAvatar || `https://picsum.photos/seed/${post.author.split(' ')[0]}/40/40`;
    const authorFallback = post.author.split(' ').map(n => n[0]).join('');
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
      <Card className="flex flex-col overflow-hidden">
        <div className="relative h-48 w-full">
            <Image
                src={post.image}
                alt={post.title}
                fill
                objectFit="cover"
                data-ai-hint={post.imageHint}
            />
        </div>
        <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription className="line-clamp-3">{post.content}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow" />
        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={authorAvatar} data-ai-hint="person face" />
                    <AvatarFallback>{authorFallback}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{post.author}</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">Read More</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{post.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 pt-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={authorAvatar} data-ai-hint="person face" />
                                <AvatarFallback>{authorFallback}</AvatarFallback>
                            </Avatar>
                            <span>By {post.author}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="prose dark:prose-invert max-w-none pt-4">
                        <p>{post.content}</p>
                    </div>
                </DialogContent>
            </Dialog>
        </CardFooter>
      </Card>
    );
}
