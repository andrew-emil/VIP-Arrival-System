import { AddDeviceDialog } from '@/components/account-devices/AddDeviceDialog';
import { AccountDevicesTable } from '@/components/account-devices/AccountDevicesTable';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';

export default function AccountDevicePage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('nav.accountDevices')}</h1>
          <AddDeviceDialog />
        </div>
        <AccountDevicesTable />
      </div>
    </DashboardLayout>
  );
}
