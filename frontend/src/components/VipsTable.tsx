import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { ProtocolLevel } from '@/types';
import { IVip } from '@/services/vip/types';

interface VipsTableProps {
  vips: IVip[];
  onEdit: (vip: IVip) => void;
  onDelete: (id: string) => void;
}

const protocolColors: Record<ProtocolLevel, string> = {
  A: 'bg-alert-error/20 text-alert-error border-alert-error/30',
  B: 'bg-alert-approaching/20 text-alert-approaching border-alert-approaching/30',
  C: 'bg-alert-confirmed/20 text-alert-confirmed border-alert-confirmed/30',
  D: 'bg-muted text-muted-foreground',
};

export function VipsTable({ vips, onEdit, onDelete }: VipsTableProps) {
  const { t } = useTranslation();

  return (
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
          {vips.map((vip) => (
            <TableRow key={vip.id}>
              <TableCell className="font-medium">{vip.name}</TableCell>
              <TableCell>{vip.company}</TableCell>
              <TableCell>
                <Badge variant="outline" className={protocolColors[vip.protocolLevel as ProtocolLevel] || protocolColors.D}>
                  {vip.protocolLevel}
                </Badge>
              </TableCell>
              <TableCell>
                {/* 
                  Note: IVip from service currently doesn't reflect multiple plates clearly.
                  Mapping it according to available fields. 
                */}
                <div className="flex flex-wrap gap-1">
                  {(vip as any).plateNumbers?.map((p: string) => (
                    <span key={p} className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{p}</span>
                  )) || (vip as any).plate && (
                     <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{(vip as any).plate}</span>
                  )}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
