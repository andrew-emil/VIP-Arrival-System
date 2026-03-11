
import React from 'react';
import { Globe, Terminal, Database, CheckCircle } from 'lucide-react';

interface DocumentationProps {
  language: 'ar' | 'en';
}

export const Documentation: React.FC<DocumentationProps> = ({ language }) => {
  const t = {
    title: language === 'ar' ? 'نظام VAS: البنية الهيكلية' : 'VAS: System Architecture',
    desc: language === 'ar' ? 'منصة متطورة لرصد وصول كبار الشخصيات تعمل بنظام الأحداث الفوري.' : 'High-performance event-driven VIP arrival detection platform.',
    specs: language === 'ar' ? 'مواصفات الـ API' : 'API Specification',
    roadmap: language === 'ar' ? 'خارطة الطريق' : 'Implementation Roadmap'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 transition-colors">
      <header className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{t.desc}</p>
      </header>

      <section className="space-y-6">
        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
          <Globe className="w-6 h-6 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t.specs}</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
           <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">POST</span>
              <code className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">/ingress/plate-reads</code>
           </div>
           <pre className="text-[10px] bg-slate-900 text-indigo-300 p-4 rounded-xl leading-relaxed" dir="ltr">
{`{
  "cameraId": "cam-01",
  "plateText": "VIP-777",
  "confidence": 0.98,
  "timestamp": "2023-10-27T10:00:00Z"
}`}
           </pre>
        </div>
      </section>

      <section className="space-y-6">
        <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
          <Terminal className="w-6 h-6 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{t.roadmap}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl">
            <h3 className="font-bold mb-2">Phase 1: Foundation</h3>
            <p className="text-sm opacity-90">Stateless REST ingestion and Postgres storage.</p>
          </div>
          <div className="p-6 bg-slate-800 dark:bg-slate-900 rounded-2xl text-white shadow-xl border border-slate-700">
            <h3 className="font-bold mb-2">Phase 2: Real-time</h3>
            <p className="text-sm opacity-90">WebSockets and Redis Pub/Sub integration.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
