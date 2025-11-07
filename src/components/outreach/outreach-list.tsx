'use client';

import { OutreachCard } from './outreach-card';
import { useUserContext } from '@/context/user-context';
import type { OutreachEvent } from '@/app/dashboard/outreaches/[outreachId]/page';
import { Loader2 } from 'lucide-react';
import React from 'react';

type OutreachListProps = {
  outreachEvents: OutreachEvent[];
  onEdit: (event: OutreachEvent) => void;
};

export function OutreachList({ outreachEvents, onEdit }: OutreachListProps) {
    const { userProfile } = useUserContext();
    const [isLoading, setIsLoading] = React.useState(true);
    const [filteredEvents, setFilteredEvents] = React.useState<OutreachEvent[]>([]);

    React.useEffect(() => {
        // Simulate loading and filtering
        setIsLoading(true);
        setTimeout(() => {
            if (userProfile) {
                if (userProfile.role === 'Reacher') {
                    setFilteredEvents(outreachEvents.filter(event => event.participantIds.includes(userProfile.uid)));
                } else {
                    setFilteredEvents(outreachEvents);
                }
            }
            setIsLoading(false);
        }, 500);
    }, [outreachEvents, userProfile]);

    if (isLoading) {
        return (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-16 col-span-full">
                <p>No outreach events found.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
            <OutreachCard key={event.id} event={event} onEdit={onEdit} />
        ))}
        </div>
    );
}
