'use client';

import { OutreachCard } from './outreach-card';
import { useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUserContext } from '@/context/user-context';
import { useMemoFirebase } from '@/firebase/provider';

export function OutreachList() {
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

    const { data: outreachEvents, isLoading } = useCollection(outreachesQuery);

  if (isLoading) {
    return <div className="text-center">Loading outreaches...</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(outreachEvents ?? []).map((event) => (
        <OutreachCard key={event.id} event={event as any} />
      ))}
    </div>
  );
}
