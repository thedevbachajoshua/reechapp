import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { leaderboard } from '@/lib/data';
  import { Crown } from 'lucide-react';
  
  export function Leaderboard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top reachers this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {leaderboard.map((user, index) => (
              <li key={user.id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground w-4">
                  {index === 0 ? <Crown className="h-5 w-5 text-primary" /> : `${index + 1}`}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                </div>
                <div className="font-semibold text-sm">{user.points} pts</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }
  