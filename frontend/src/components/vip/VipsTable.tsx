import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VipItem } from '@/services/vip';
import { ProtocolLevel } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VipsTableProps {
  vips: VipItem[];
  onEdit: (vip: VipItem) => void;
  onDelete: (id: string) => void;
}

const protocolColors: Record<ProtocolLevel, string> = {
  A: 'bg-alert-error/20 text-alert-error border-alert-error/30',
  B: 'bg-alert-approaching/20 text-alert-approaching border-alert-approaching/30',
  C: 'bg-alert-confirmed/20 text-alert-confirmed border-alert-confirmed/30',
  D: 'bg-muted text-muted-foreground',
};

export function VipsTable({ vips, onEdit, onDelete }: VipsTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.name')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.company')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('vips.protocolLevel')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('vips.plateNumbers')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vips.map((vip) => {
            const allPlates = vip.plates.map((p) => p.plateNumber);
            return (
              <TableRow key={vip.id}>
                <TableCell className="font-medium">{vip.name}</TableCell>
                <TableCell>{vip.company}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={protocolColors[vip.protocolLevel as ProtocolLevel] || protocolColors.D}>
                    {vip.protocolLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {allPlates.map((plate) => (
                      <span key={plate} className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {plate}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(vip)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(vip.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
