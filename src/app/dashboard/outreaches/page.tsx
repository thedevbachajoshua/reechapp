'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OutreachList } from '@/components/outreach/outreach-list';
import { CreateOutreachForm } from '@/components/outreach/create-outreach-form';

export default function OutreachesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Outreaches</h1>
          <p className="text-muted-foreground">
            Manage and track your team's outreach events.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Outreach
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Outreach</DialogTitle>
              <DialogDescription>
                Plan a new event to reach your community.
              </DialogDescription>
            </DialogHeader>
            <CreateOutreachForm onFinished={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <OutreachList />
    </div>
  );
}
