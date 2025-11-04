import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { followUps } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';

export default function FollowUpsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Scheduled Follow-ups</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {followUps.map((followUp) => (
          <Card key={followUp.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{followUp.contactName}</CardTitle>
                  <CardDescription>{followUp.scheduledFor}</CardDescription>
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={followUp.contactAvatar} data-ai-hint="person face" />
                  <AvatarFallback>{followUp.contactName.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                "{followUp.message}"
              </p>
              <Badge 
                variant={followUp.status === 'Sent' ? 'secondary' : 'default'}
                className={followUp.status === 'Scheduled' ? 'bg-accent text-accent-foreground w-fit' : 'w-fit'}
              >
                {followUp.status === 'Scheduled' ? <Clock className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
                {followUp.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
