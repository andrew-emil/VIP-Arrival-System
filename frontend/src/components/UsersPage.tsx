
import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { VAS_ICONS } from '../config/icons';

interface UsersPageProps {
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  language: 'ar' | 'en';
}

export const UsersPage: React.FC<UsersPageProps> = ({ users, setUsers, language }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const t = {
    title: language === 'ar' ? 'إدارة المستخدمين' : 'User Management',
    add: language === 'ar' ? 'إضافة مستخدم' : 'Add User',
    name: language === 'ar' ? 'الاسم' : 'Name',
    role: language === 'ar' ? 'الدور' : 'Role',
    status: language === 'ar' ? 'الحالة' : 'Status',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
    roles: {
      Admin: language === 'ar' ? 'مدير نظام' : 'System Admin',
      Operator: language === 'ar' ? 'مشغل' : 'Operator',
      Protocol: language === 'ar' ? 'بروتوكول' : 'Protocol',
      Security: language === 'ar' ? 'أمن' : 'Security',
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const user: UserAccount = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      role: fd.get('role') as UserRole,
      status: fd.get('status') as any,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
    };
    if (editingUser) setUsers(users.map(u => u.id === user.id ? user : u));
    else setUsers([...users, user]);
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl active:scale-95">
          <VAS_ICONS.users size={18} />
          {t.add}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <table className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.name}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.status}</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all">
                <td className="px-8 py-6">
                   <div className="font-black text-slate-900 dark:text-white">{user.name}</div>
                   <div className="text-xs text-slate-500 font-bold">{user.email}</div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase">
                     {t.roles[user.role]}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`}></div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">{user.status}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingUser(user); setShowModal(true); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><VAS_ICONS.edit size={18} /></button>
                      <button onClick={() => setUsers(users.filter(u => u.id !== user.id))} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-rose-500"><VAS_ICONS.trash size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
           <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-black dark:text-white">{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h3>
                 <button type="button" onClick={() => setShowModal(false)}><VAS_ICONS.trash className="rotate-45" /></button>
              </div>
              <div className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.name}</label>
                    <input name="name" defaultValue={editingUser?.name} required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.role}</label>
                      <select name="role" defaultValue={editingUser?.role || 'Operator'} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none">
                         <option value="Admin">Admin</option>
                         <option value="Operator">Operator</option>
                         <option value="Protocol">Protocol</option>
                         <option value="Security">Security</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.status}</label>
                      <select name="status" defaultValue={editingUser?.status || 'Active'} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none">
                         <option value="Active">Active</option>
                         <option value="Disabled">Disabled</option>
                      </select>
                   </div>
                 </div>
                 <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                    {editingUser ? 'تحديث البيانات' : 'تفعيل الحساب'}
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
