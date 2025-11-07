'use client';

import { OutreachCard } from './outreach-card';
import { useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUserContext } from '@/context/user-context';
import { useMemoFirebase } from '@/firebase/provider';
import type { OutreachEvent } from '@/app/dashboard/outreaches/[outreachId]/page';
import { Loader2 } from 'lucide-react';

type OutreachListProps = {
  onEdit: (event: OutreachEvent) => void;
};

export function OutreachList({ onEdit }: OutreachListProps) {
    const { userProfile } = useUserContext();
    const firestore = useFirestore();

    const outreachesQuery = useMemoFirebase(() => {
        if (!firestore || !userProfile) return null;

        const baseQuery = collection(firestore, 'outreaches');

        if (userProfile.role === 'Reacher') {
            return query(baseQuery, where('participantIds', 'array-contains', userProfile.uid));
        }

        return baseQuery;
    }, [firestore, userProfile]);

    // The conditional query was causing an internal Firebase SDK error.
    // By separating the query from the hook and only calling the hook when the query is ready,
    // we ensure the listener lifecycle is more stable.
    if (!outreachesQuery) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    return <OutreachContent onEdit={onEdit} outreachesQuery={outreachesQuery} />;
}


function OutreachContent({ onEdit, outreachesQuery }: { onEdit: (event: OutreachEvent) => void, outreachesQuery: query, }) {
    const { data: outreachEvents, isLoading } = useCollection<OutreachEvent>(outreachesQuery);

    if (isLoading) {
        return (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!outreachEvents || outreachEvents.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-16 col-span-full">
                <p>No outreach events found.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {outreachEvents.map((event) => (
            <OutreachCard key={event.id} event={event} onEdit={onEdit} />
        ))}
        </div>
    );
}