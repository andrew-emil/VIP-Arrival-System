import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil } from 'lucide-react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mock';

const roleColors: Record<UserRole, string> = {
  admin: 'bg-alert-error/20 text-alert-error',
  operator: 'bg-alert-confirmed/20 text-alert-confirmed',
  manager: 'bg-alert-approaching/20 text-alert-approaching',
  gate: 'bg-muted text-muted-foreground',
};

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'operator' as UserRole });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'operator' });
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setUsers(users.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
    } else {
      setUsers([...users, { id: `u-${Date.now()}`, ...form, isActive: true }]);
    }
    setDialogOpen(false);
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

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.email')}</TableHead>
                <TableHead>{t('common.role')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-mono text-xs">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[user.role]}>
                      {t(`users.${user.role === 'gate' ? 'gateStaff' : user.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(user)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
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
            <DialogTitle>{editing ? t('users.editUser') : t('users.addUser')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('common.name')}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('common.email')}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('common.role')}</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('users.admin')}</SelectItem>
                  <SelectItem value="operator">{t('users.operator')}</SelectItem>
                  <SelectItem value="manager">{t('users.manager')}</SelectItem>
                  <SelectItem value="gate">{t('users.gateStaff')}</SelectItem>
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
