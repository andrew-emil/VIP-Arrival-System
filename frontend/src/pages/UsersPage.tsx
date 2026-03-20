import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UserDialog } from '@/components/user/UserDialog';
import { UserTable } from '@/components/user/UserTable';
import { getUsers } from '@/services/users/query';
import { UsersQueryKeys } from '@/services/users/queryKeys';
import { IUser } from '@/services/users/types';

export default function UsersPage() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: UsersQueryKeys.findAll(),
    queryFn: getUsers,
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
          <UserTable users={users} onEdit={openEdit} />
        )}
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onClose={handleDialogClose}
      />
    </DashboardLayout>
  );
}
