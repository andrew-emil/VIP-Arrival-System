import LoadingIndicator from '@/components/LoadingIndicator';
import { useUser } from '@/hooks/useUser';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { VAS_ICONS } from '../config/icons';
import { Role } from '../types/auth';

export const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate()
  const language = i18n.language;
  const isRtl = language === 'ar';
  const { user, handleLogout, loading } = useUser()

  const groups = [
    {
      title: t('nav_operations', 'Operations'),
      items: [
        { id: 'dashboard', label: t('nav_dashboard', 'Operations Dashboard'), path: '/dashboard', icon: 'dashboard', roles: [Role.MANAGER, Role.OPERATOR] },
        { id: 'admin', label: t('nav_admin', 'Admin Panel'), path: '/admin', icon: 'security', roles: [Role.ADMIN] },
        { id: 'monitor', label: t('nav_monitor', 'Monitor'), path: '/monitor', icon: 'activity', roles: [Role.MANAGER, Role.OBSERVER] },
        { id: 'timeline', label: t('nav_timeline', 'Timeline'), path: '/sessions', icon: 'history', roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR] },
        { id: 'cameras', label: t('nav_cameras', 'Cameras'), path: '/cameras', icon: 'cameras', roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR] },
      ]
    },
    {
      title: t('nav_management', 'Management'),
      items: [
        { id: 'vips', label: t('nav_vips', 'Guests Directory'), path: '/vips', icon: 'vips', roles: [Role.ADMIN, Role.MANAGER, Role.OPERATOR] },
        { id: 'zones', label: t('nav_zones', 'Zones & Gates'), path: '/zones', icon: 'zones', roles: [Role.ADMIN, Role.MANAGER] },
        { id: 'devices', label: t('nav_devices', 'Devices'), path: '/devices', icon: 'device', roles: [Role.ADMIN] },
        { id: 'users', label: t('nav_users', 'Users'), path: '/users', icon: 'users', roles: [Role.ADMIN] },
      ]
    }
  ];

  const filteredGroups = groups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user.role))
  })).filter(group => group.items.length > 0);

  // Find active label for breadcrumbs
  const activeItem = groups.flatMap(g => g.items).find(i => location.pathname === i.path);
  const breadcrumbLabel = activeItem ? activeItem.label : 'VAS COMMAND';

  return (
    <div
      className={`flex h-screen w-full bg-[#020617] text-[#f8fafc] overflow-hidden ${isRtl ? "flex-row-reverse" : "flex-row"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Main Content Area (Left on RTL, Right on LTR) */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-16 md:h-18 bg-[#020617]/50 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <span>VAS</span>
              <VAS_ICONS.arrow size={10} className={isRtl ? 'rotate-180' : ''} />
              <span className="text-white">{breadcrumbLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-[#1e293b]/50 rounded-2xl border border-[#1e293b] group hover:bg-primary/10 transition-all">
              <VAS_ICONS.notifications size={20} className="text-slate-400 group-hover:text-primary" />
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full border-2 border-[#020617] flex items-center justify-center animate-bounce shadow-lg shadow-rose-600/20">
                50
              </span>
            </button>

            <div className={`flex items-center gap-4 ${isRtl ? 'pr-6 border-r' : 'pl-6 border-l'} border-[#1e293b]`}>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <p className="text-[11px] font-black text-white leading-none mb-1">{user.name}</p>
                <span className="text-[9px] text-[#22c55e] font-black uppercase tracking-widest leading-none">{user.role}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#1e293b] overflow-hidden ring-4 ring-[#1e293b]/30">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-[#020617]">
          <Outlet />
        </div>
      </div>

      {/* Sidebar (Right on RTL, Left on LTR) */}
      <aside
        className={`w-64 lg:w-72 xl:w-80 bg-[#020617] flex flex-col z-50
    ${isRtl ? "border-l" : "border-r"} border-[#1e293b]`}
      >
        <div className="p-4 md:p-6 flex items-center justify-center border-b border-[#1e293b]/50">
          <div className="flex items-center gap-4">
            <div className={`text-right ${isRtl ? 'items-end' : 'items-start'} flex flex-col`}>
              <span className="text-xl font-black text-white tracking-tighter leading-none block">VAS COMMAND</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">PLATFORM_v2.5</span>
            </div>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(147,51,234,0.4)]">V</div>
          </div>
        </div>

        <nav className="flex-1 px-3 md:px-4 pt-6 md:pt-8 space-y-6 overflow-y-auto no-scrollbar">
          {filteredGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <p className={`px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ${isRtl ? 'text-right' : 'text-left'}`}>
                {group.title}
              </p>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const Icon = VAS_ICONS[item.icon as keyof typeof VAS_ICONS];
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) => `
                        w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative
                        ${isActive
                          ? 'bg-primary text-white shadow-2xl shadow-primary/20'
                          : 'hover:bg-[#1e293b]/40 text-slate-400 hover:text-white'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 transition-colors`} />
                      <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
                      {location.pathname === item.path && (
                        <div className={`absolute ${isRtl ? '-right-1' : '-left-1'} w-1 h-6 bg-white rounded-full`}></div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 md:p-6 space-y-3 border-t border-[#1e293b]/50">
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
              ${isActive ? 'bg-[#1e293b] text-white' : 'text-slate-500 hover:text-white'}
            `}
          >
            <VAS_ICONS.settings size={20} />
            <span className="font-black text-[11px] uppercase tracking-widest">{t('nav_settings', 'Settings')}</span>
          </NavLink>

          <button
            onClick={async () => {
              await handleLogout()
              navigate('/login')
            }}
            disabled={loading}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all group"
          >
            {
              loading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <VAS_ICONS.logout size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-black text-[11px] uppercase tracking-widest">{t('nav_logout', 'Logout')}</span>
                </>
              )
            }
          </button>
        </div>
      </aside>
    </div>
  );
};
