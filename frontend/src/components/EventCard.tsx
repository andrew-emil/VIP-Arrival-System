import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IEvent } from '@/services/events/types';
import { Calendar, Play, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EventCardProps {
  event: IEvent;
  onClick: (event: IEvent) => void;
  onToggleStatus: (event: IEvent) => void;
  isToggling: boolean;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-alert-arrived/20 text-alert-arrived border-alert-arrived/30',
  completed: 'bg-muted text-muted-foreground',
};

export function EventCard({ event, onClick, onToggleStatus, isToggling }: EventCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => onClick(event)}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{event.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={statusColors[event.status as string] || statusColors.draft}>
              {t(`events.${event.status}`)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {((event as IEvent & { vipIds?: string[] }).vipIds?.length || 0)} VIPs
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleStatus(event); 
          }}
          disabled={isToggling}
        >
          {event.status === 'active' ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-mono">
            {new Date(event.startTime).toLocaleDateString()} — {new Date(event.endTime).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
