import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VipsTable } from '@/components/VipsTable';
import { VipsDialog } from '@/components/VipsDialog';
import { getVips } from '@/services/vip/query';
import { deleteVip } from '@/services/vip/mutation';
import { VipQueryKeys } from '@/services/vip/queryKeys';
import { IVip } from '@/services/vip/types';

export default function VipsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IVip | null>(null);

  const { data: vips = [], isLoading } = useQuery({
    queryKey: VipQueryKeys.all(),
    queryFn: () => getVips(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVip(id),
    onSuccess: () => {
      toast.success(t('vips.deleteSuccess', 'VIP deleted successfully'));
      queryClient.invalidateQueries({ queryKey: VipQueryKeys.all() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const filtered = vips.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v as any).plateNumbers?.some((p: string) => p.toLowerCase().includes(search.toLowerCase())) ||
      (v as any).plate?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (vip: IVip) => {
    setEditing(vip);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('common.confirmDelete', 'Are you sure you want to delete this item?'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg">
            {t('common.noData', 'No VIPs found')}
          </div>
        ) : (
          <VipsTable vips={filtered} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      <VipsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onClose={handleDialogClose}
      />
    </DashboardLayout>
  );
}
