import { ActivityChart } from '@/components/dashboard/activity-chart';
import { Leaderboard } from '@/components/dashboard/leaderboard';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <StatsCards />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
      <RecentActivity />
    </div>
  );
}
