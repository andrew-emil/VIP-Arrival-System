import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useVipStore } from '@/stores/vipStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { VIP, ProtocolLevel } from '@/types';

const protocolColors: Record<ProtocolLevel, string> = {
  A: 'bg-alert-error/20 text-alert-error border-alert-error/30',
  B: 'bg-alert-approaching/20 text-alert-approaching border-alert-approaching/30',
  C: 'bg-alert-confirmed/20 text-alert-confirmed border-alert-confirmed/30',
  D: 'bg-muted text-muted-foreground',
};

export default function VipsPage() {
  const { t } = useTranslation();
  const { vipList, addVip, updateVip, deleteVip } = useVipStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VIP | null>(null);
  const [form, setForm] = useState({ name: '', company: '', protocolLevel: 'B' as ProtocolLevel, plateNumbers: '', notes: '' });

  const filtered = vipList.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.plateNumbers.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', company: '', protocolLevel: 'B', plateNumbers: '', notes: '' });
    setDialogOpen(true);
  };

  const openEdit = (vip: VIP) => {
    setEditing(vip);
    setForm({
      name: vip.name,
      company: vip.company,
      protocolLevel: vip.protocolLevel,
      plateNumbers: vip.plateNumbers.join(', '),
      notes: vip.notes,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const plates = form.plateNumbers.split(',').map((p) => p.trim()).filter(Boolean);
    if (editing) {
      updateVip(editing.id, { ...form, plateNumbers: plates });
    } else {
      addVip({
        id: `v-${Date.now()}`,
        ...form,
        plateNumbers: plates,
        photo: '',
      });
    }
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold">{t('vips.title')}</h1>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {t('vips.addVip')}
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('vips.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.company')}</TableHead>
                <TableHead>{t('vips.protocolLevel')}</TableHead>
                <TableHead>{t('vips.plateNumbers')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vip) => (
                <TableRow key={vip.id}>
                  <TableCell className="font-medium">{vip.name}</TableCell>
                  <TableCell>{vip.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={protocolColors[vip.protocolLevel]}>
                      {vip.protocolLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {vip.plateNumbers.map((p) => (
                        <span key={p} className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(vip)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVip(vip.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('vips.editVip') : t('vips.addVip')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('common.name')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('common.company')}</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('vips.protocolLevel')}</Label>
              <Select value={form.protocolLevel} onValueChange={(v) => setForm({ ...form, protocolLevel: v as ProtocolLevel })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['A', 'B', 'C', 'D'].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('vips.plateNumbers')}</Label>
              <Input
                value={form.plateNumbers}
                onChange={(e) => setForm({ ...form, plateNumbers: e.target.value })}
                placeholder="ABC 1234, DEF 5678"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.notes')}</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
