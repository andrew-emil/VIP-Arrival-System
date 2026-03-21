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
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { UserDialog } from '@/components/user/UserDialog';
import { UserTable } from '@/components/user/UserTable';
import { deleteUser, getUsers, IUser, UsersQueryKeys } from '@/services/users';

export default function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IUser | null>(null);
  const [deleting, setDeleting] = useState<IUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: UsersQueryKeys.findAll(),
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (user: IUser) => deleteUser(user.id),
    onSuccess: (_, deletedUser) => {
      // Optimistically remove user from cache to instantly update UI
      queryClient.setQueryData(UsersQueryKeys.findAll(), (old: IUser[] | undefined) =>
        old ? old.filter(u => u.id !== deletedUser.id) : []
      );
      toast.success(t('users.deleteSuccess', 'User deleted successfully'));
      // Wait for background sync
      queryClient.invalidateQueries({ queryKey: UsersQueryKeys.findAll() });
      setDeleting(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
      setDeleting(null);
    },
  });

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (user: IUser) => {
    setEditing(user);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">{t('users.title')}</h1>
          <Button onClick={openAdd} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {t('users.addUser')}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('common.noData', 'No data available')}
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={openEdit}
            onDelete={(user) => setDeleting(user)}
          />
        )}
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onClose={handleDialogClose}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete', 'Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.confirmDelete', 'Are you sure you want to delete this user?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleting) deleteMutation.mutate(deleting);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('common.confirm', 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

