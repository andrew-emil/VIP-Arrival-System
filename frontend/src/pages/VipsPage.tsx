import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VipsDialog } from '@/components/vip/VipsDialog';
import { VipsTable } from '@/components/vip/VipsTable';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { deleteVip, getVips, VipItem, VipQueryKeys } from '@/services/vip';

export default function VipsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VipItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: vips = [], isLoading } = useQuery({
    queryKey: VipQueryKeys.all(),
    queryFn: () => getVips(),
  });
  console.log(vips)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVip(id),
    onSuccess: () => {
      toast.success(t('vips.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: VipQueryKeys.all() });
      setDeleting(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error'));
      setDeleting(null);
    }
  });

  const filtered = vips.filter((vip) => {
    const allPlates = vip.plates.map((p) => p.plateNumber)
    return (
      vip.name?.toLowerCase().includes(search.toLowerCase()) ||
      allPlates.some((p) => p.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (vip: VipItem) => {
    setEditing(vip);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleting(id);
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
            {t('common.noData')}
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

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('vips.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleting) deleteMutation.mutate(deleting);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
