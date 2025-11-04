import { outreachEvents } from '@/lib/data';
import { OutreachCard } from './outreach-card';

export function OutreachList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {outreachEvents.map((event) => (
        <OutreachCard key={event.id} event={event} />
      ))}
    </div>
  );
}
