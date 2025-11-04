import { EncouragementGenerator } from '@/components/ai/encouragement-generator';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiEncouragementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold font-headline">AI Encouragement</h1>
         <p className="text-muted-foreground">Generate personalized encouragements with relevant scriptures.</p>
      </div>
      <EncouragementGenerator />
    </div>
  );
}
