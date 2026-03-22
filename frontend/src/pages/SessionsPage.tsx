import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSessions, SessionsQueryKeys, SessionStatus } from '@/services/sessions';
import { ISession } from '@/services/sessions/types';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const statusColors: Record<SessionStatus, string> = {
  [SessionStatus.REGISTERED]: 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400',
  [SessionStatus.APPROACHING]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  [SessionStatus.ARRIVED]: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  [SessionStatus.CONFIRMED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  [SessionStatus.COMPLETED]: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400',
  [SessionStatus.REJECTED]: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

const formatDate = (date: Date | string | null) => {
  if (!date) return '-';
  return format(new Date(date), 'dd MMM yyyy, HH:mm:ss');
};

export default function SessionsPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const isRtl = i18n.language === 'ar';

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: SessionsQueryKeys.findAll(),
    queryFn: getSessions,
  });

  const filtered = sessions.filter((s: ISession) => {
    const term = search.toLowerCase();
    const vipName = s.vip?.name?.toLowerCase() || '';
    const plate = (s.vip as unknown as { plate?: string }).plate?.toLowerCase() || '';
    
    return vipName.includes(term) || plate.includes(term);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold">{t('sessions.title', 'Arrival Sessions')}</h1>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('sessions.searchPlaceholder', 'Search by VIP or plate...')}
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
            {t('common.noData', 'No data found')}
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('sessions.vip', 'VIP')}</TableHead>
                  <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('sessions.status', 'Status')}</TableHead>
                  <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('sessions.approachedAt', 'Approached At')}</TableHead>
                  <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('sessions.arrivedAt', 'Arrived At')}</TableHead>
                  <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('sessions.confirmedAt', 'Confirmed At')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((session: ISession) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{session.vip?.name || '-'}</span>
                        <span className="text-xs text-muted-foreground font-mono mt-0.5">
                          {(session.vip as unknown as { plate?: string }).plate || '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[session.status] || ''}>
                        {t(`alerts.${session.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(session.approachAt)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(session.arrivedAt)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(session.confirmedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
