import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, HeartHandshake, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { UserProfile, leaderboard } from '@/lib/data';
import { useUserContext } from '@/context/user-context';
import type { OutreachEvent } from '@/app/dashboard/outreaches/[outreachId]/page';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

type OutreachCardProps = {
  event: OutreachEvent;
  onEdit: (event: OutreachEvent) => void;
};


const OutreachParticipants = ({ participantIds }: { participantIds: string[] }) => {
    const [participants, setParticipants] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate fetching participants
        const fetchedParticipants = leaderboard.filter(u => participantIds.includes(String(u.id)));
        setParticipants(fetchedParticipants);
        setIsLoading(false);
    }, [participantIds]);

  if (isLoading) {
    return <div className="h-8 w-full animate-pulse bg-muted rounded-md" />;
  }

  if (!participants || participants.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center -space-x-2">
      {participants.slice(0, 5).map((p) => (
        <Avatar key={p.id} className="h-8 w-8 border-2 border-background">
          <AvatarImage src={p.avatar} data-ai-hint="person face" />
          <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {participants.length > 5 && (
        <Avatar className="h-8 w-8 border-2 border-background">
          <AvatarFallback>+{participants.length - 5}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};


export function OutreachCard({ event, onEdit }: OutreachCardProps) {
  const { userProfile } = useUserContext();
  const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Planned: 'secondary',
    Ongoing: 'default',
    Completed: 'destructive',
  };

  return (
    <Card className="flex flex-col transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-xl pr-2">{event.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariantMap[event.status]} className={event.status === 'Ongoing' ? 'bg-primary text-primary-foreground' : ''}>{event.status}</Badge>
              {userProfile?.role === 'Supervisor' && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(event)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Edit Outreach</span>
                  </Button>
              )}
            </div>
        </div>
        <CardDescription className="flex items-center gap-4 text-sm pt-2">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center justify-around text-center">
            <div>
                <p className="font-bold text-2xl">{event.participantIds.length}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Reachers</p>
            </div>
            <div>
                <p className="font-bold text-2xl">{event.newConverts?.length || 0}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><HeartHandshake className="h-4 w-4" /> Converts</p>
            </div>
        </div>
         <OutreachParticipants participantIds={event.participantIds} />
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href={`/dashboard/outreaches/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
