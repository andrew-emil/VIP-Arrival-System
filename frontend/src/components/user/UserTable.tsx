import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IUser, Role } from '@/services/users/types';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
}

const roleColors: Record<string, string> = {
  [Role.ADMIN]: 'bg-alert-error/20 text-alert-error',
  [Role.OPERATOR]: 'bg-alert-confirmed/20 text-alert-confirmed',
  [Role.MANAGER]: 'bg-alert-approaching/20 text-alert-approaching',
  [Role.GATE_GUARD]: 'bg-muted text-muted-foreground',
};

const displayRole = (role: string) => {
  switch (role) {
    case Role.ADMIN: return 'admin';
    case Role.OPERATOR: return 'operator';
    case Role.MANAGER: return 'manager';
    case Role.GATE_GUARD: return 'gateStaff';
    default: return role.toLowerCase();
  }
};

export function UserTable({ users, onEdit }: UserTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.name')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.email')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.role')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.status')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="font-mono text-xs">{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className={roleColors[user.role as string] || 'bg-muted'}>
                  {t(`users.${displayRole(user.role as string)}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
