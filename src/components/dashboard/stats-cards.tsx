import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { stats } from '@/lib/data';
import { Users, MessageSquare, CheckCircle } from 'lucide-react';

const iconMap = {
    'New Believers': <Users className="h-5 w-5 text-muted-foreground" />,
    'Follow-ups Sent': <MessageSquare className="h-5 w-5 text-muted-foreground" />,
    'Completion Rate': <CheckCircle className="h-5 w-5 text-muted-foreground" />,
};
  
export function StatsCards() {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {iconMap[stat.label as keyof typeof iconMap]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
}
