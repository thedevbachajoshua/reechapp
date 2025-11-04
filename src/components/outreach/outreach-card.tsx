import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

type NewConvert = {
    name: string;
    phone: string;
    status: string;
    assignedTo: string;
    notes: string;
};

type OutreachEvent = {
  id: number;
  title: string;
  date: string;
  location: string;
  status: 'Planned' | 'Ongoing' | 'Completed';
  newConverts: NewConvert[];
  participants: { name: string; avatar: string }[];
};

export function OutreachCard({ event }: { event: OutreachEvent }) {
  const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Planned: 'secondary',
    Ongoing: 'default',
    Completed: 'destructive',
  };

  return (
    <Card className="flex flex-col transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <Badge variant={statusVariantMap[event.status]} className={event.status === 'Ongoing' ? 'bg-primary text-primary-foreground' : ''}>{event.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-4 text-sm pt-2">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center justify-around text-center">
            <div>
                <p className="font-bold text-2xl">{event.participants.length}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Reachers</p>
            </div>
            <div>
                <p className="font-bold text-2xl">{event.newConverts.length}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><HeartHandshake className="h-4 w-4" /> Converts</p>
            </div>
        </div>
         <div className="flex items-center justify-center -space-x-2">
            {event.participants.slice(0, 5).map((p) => (
              <Avatar key={p.name} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={p.avatar} data-ai-hint="person face"/>
                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {event.participants.length > 5 && (
                <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback>+{event.participants.length - 5}</AvatarFallback>
                </Avatar>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href={`/dashboard/outreaches/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
