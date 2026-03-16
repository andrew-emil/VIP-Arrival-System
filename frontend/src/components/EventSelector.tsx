import { useEventStore } from '@/stores/eventStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export function EventSelector() {
  const { t } = useTranslation();
  const events = useEventStore((s) => s.events);
  const activeEventId = useEventStore((s) => s.activeEventId);
  const setActiveEvent = useEventStore((s) => s.setActiveEvent);

  return (
    <Select value={activeEventId || ''} onValueChange={(v) => setActiveEvent(v || null)}>
      <SelectTrigger className="w-[180px] lg:w-[220px] h-9 text-sm">
        <SelectValue placeholder={t('events.selectEvent')} />
      </SelectTrigger>
      <SelectContent>
        {events.map((event) => (
          <SelectItem key={event.id} value={event.id}>
            {event.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
