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
import { useUserContext } from '@/context/user-context';
import { OutreachEvent } from './[outreachId]/page';

export default function OutreachesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingOutreach, setEditingOutreach] = React.useState<OutreachEvent | null>(null);
  const { userProfile } = useUserContext();
  
  const handleOpenEditDialog = (outreach: OutreachEvent) => {
    setEditingOutreach(outreach);
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingOutreach(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Outreaches</h1>
          <p className="text-muted-foreground">
            Manage and track your team's outreach events.
          </p>
        </div>
        {userProfile?.role === 'Supervisor' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              <CreateOutreachForm onFinished={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
          <OutreachList onEdit={handleOpenEditDialog} />
          {editingOutreach && (
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Outreach</DialogTitle>
                <DialogDescription>
                  Update the details for this outreach event.
                </DialogDescription>
              </DialogHeader>
              <CreateOutreachForm
                onFinished={handleCloseEditDialog}
                outreachToEdit={editingOutreach}
              />
            </DialogContent>
          )}
      </Dialog>
    </div>
  );
}
