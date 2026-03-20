import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EventCard } from '@/components/event/EventCard';
import { EventDialog } from '@/components/event/EventDialog';
import { updateEvent } from '@/services/events/mutation';
import { getEvents } from '@/services/events/query';
import { EventsQueryKeys } from '@/services/events/queryKeys';
import { IEvent, UpdateEventDto } from '@/services/events/types';

export default function EventsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IEvent | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: EventsQueryKeys.all(),
    queryFn: getEvents,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEventDto }) => updateEvent(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EventsQueryKeys.all() });
    },
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (event: IEvent) => {
    setEditing(event);
    setDialogOpen(true);
  };

  const handleToggleStatus = (event: IEvent) => {
    toggleStatusMutation.mutate({
      id: event.id,
      dto: { status: event.status === 'active' ? 'draft' : 'active' }
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">{t('events.title')}</h1>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {t('events.addEvent')}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('events.noEvents', 'No events found')}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={openEdit}
                onToggleStatus={handleToggleStatus}
                isToggling={toggleStatusMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onClose={handleDialogClose}
      />
    </DashboardLayout>
  );
}
