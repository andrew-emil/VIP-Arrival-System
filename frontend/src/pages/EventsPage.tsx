import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useEventStore } from '@/stores/eventStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Play, Square } from 'lucide-react';
import { VASEvent, EventStatus } from '@/types';

const statusColors: Record<EventStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-alert-arrived/20 text-alert-arrived border-alert-arrived/30',
  completed: 'bg-muted text-muted-foreground',
};

export default function EventsPage() {
  const { t } = useTranslation();
  const { events, addEvent, updateEvent } = useEventStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VASEvent | null>(null);
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', status: 'draft' as EventStatus });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', startTime: '', endTime: '', status: 'draft' });
    setDialogOpen(true);
  };

  const openEdit = (event: VASEvent) => {
    setEditing(event);
    setForm({ name: event.name, startTime: event.startTime.slice(0, 16), endTime: event.endTime.slice(0, 16), status: event.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateEvent(editing.id, { ...form });
    } else {
      addEvent({ id: `e-${Date.now()}`, ...form, vipIds: [] });
    }
    setDialogOpen(false);
  };

  const toggleStatus = (event: VASEvent) => {
    updateEvent(event.id, { status: event.status === 'active' ? 'draft' : 'active' });
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

        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="cursor-pointer" onClick={() => openEdit(event)}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{event.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={statusColors[event.status]}>
                      {t(`events.${event.status}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{event.vipIds.length} VIPs</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); toggleStatus(event); }}
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
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('events.editEvent') : t('events.addEvent')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('common.name')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('events.startTime')}</Label>
                <Input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{t('events.endTime')}</Label>
                <Input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('common.status')}</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('events.draft')}</SelectItem>
                  <SelectItem value="active">{t('events.active')}</SelectItem>
                  <SelectItem value="completed">{t('events.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
