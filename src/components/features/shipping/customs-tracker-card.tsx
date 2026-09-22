'use client';

import { useState } from 'react';
import { 
  Ship, Anchor, CheckCircle2, Clock, AlertTriangle, 
  Copy, ExternalLink, Edit3, Check, FileCheck, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type CustomsStage = 'acid_issued' | 'in_transit' | 'arrived_port' | 'under_inspection' | 'cleared';

interface CustomsTrackerCardProps {
  orderNumber: string;
  initialAcidNumber?: string;
  initialPort?: string;
  initialBlNumber?: string;
  initialCarrier?: string;
  initialStage?: CustomsStage;
  locale: string;
}

const EGYPTIAN_PORTS = [
  { value: 'alexandria', labelAr: 'ميناء الإسكندرية البحري', labelEn: 'Alexandria Port' },
  { value: 'sokhna', labelAr: 'ميناء العين السخنة', labelEn: 'Ain Sokhna Port' },
  { value: 'portsaid', labelAr: 'ميناء شرق/غرب بورسعيد', labelEn: 'Port Said Port' },
  { value: 'damietta', labelAr: 'ميناء دمياط', labelEn: 'Damietta Port' },
  { value: 'cairo_cargo', labelAr: 'قرية البضائع - مطار القاهرة', labelEn: 'Cairo Air Cargo' },
];

const CUSTOMS_STAGES: { id: CustomsStage; labelAr: string; labelEn: string; descAr: string; descEn: string }[] = [
  {
    id: 'acid_issued',
    labelAr: 'رقم ACID صادر ومطابق',
    labelEn: 'ACID Issued & Matched',
    descAr: 'تم إصدار رقم القيد الجمركي المبدئي (19 رقماً) عبر نافذة Nafeza بنجاح.',
    descEn: 'Initial 19-digit customs number generated and validated on Nafeza.',
  },
  {
    id: 'in_transit',
    labelAr: 'مشحون بحراً / الحاوية مبحرة',
    labelEn: 'Vessel in Transit',
    descAr: 'الحاوية على ظهر السفينة متجهة إلى الموانئ المصرية.',
    descEn: 'Container loaded on vessel navigating to Egyptian territorial waters.',
  },
  {
    id: 'arrived_port',
    labelAr: 'وصل رصيف الميناء المصري',
    labelEn: 'Arrived at Egyptian Port',
    descAr: 'تم تفريغ الحاوية على رصيف الميناء وبدء مطابقة البيانات الجمركية.',
    descEn: 'Vessel berthed, container unloaded for terminal handling.',
  },
  {
    id: 'under_inspection',
    labelAr: 'قيد الفحص والمطابقة (GOEIC)',
    labelEn: 'Under Inspection (GOEIC)',
    descAr: 'معاينة هيئة الرقابة على الصادرات والواردات وسحب العينات.',
    descEn: 'Quality and standards inspection by Egyptian authorities.',
  },
  {
    id: 'cleared',
    labelAr: 'إفراج جمركي نهائي (خروج الحاوية)',
    labelEn: 'Customs Cleared & Released',
    descAr: 'تم سداد الرسوم الجمركية والضريبة، والإفراج عن البضاعة للتسليم.',
    descEn: 'Duties settled and goods cleared for final warehouse delivery.',
  },
];

export function CustomsTrackerCard({
  orderNumber,
  initialAcidNumber = '4920-8194-0194-8210',
  initialPort = 'sokhna',
  initialBlNumber = 'COSU-639201948',
  initialCarrier = 'COSCO Shipping Lines',
  initialStage = 'in_transit',
  locale,
}: CustomsTrackerCardProps) {
  const isArabic = locale === 'ar';
  const [acidNumber, setAcidNumber] = useState(initialAcidNumber);
  const [blNumber, setBlNumber] = useState(initialBlNumber);
  const [selectedPort, setSelectedPort] = useState(initialPort);
  const [currentStage, setCurrentStage] = useState<CustomsStage>(initialStage);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStageIndex = (stage: CustomsStage) => {
    return CUSTOMS_STAGES.findIndex(s => s.id === stage);
  };

  const currentIdx = getStageIndex(currentStage);

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm",
      isArabic ? "font-cairo" : ""
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                {isArabic ? 'تتبع الشحن والجمارك المصرية (منظومة نافذة - ACID)' : 'Egyptian Customs & Nafeza ACID Tracker'}
              </h3>
              <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                قانون 207 لسنة 2020
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isArabic 
                ? 'نظام التسجيل المسبق للشحنات وإجراءات المطابقة قبل الإفراج عن الحاويات'
                : 'Advance Cargo Information (ACI) & pre-clearance pipeline'}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs self-start sm:self-auto gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isEditing 
            ? (isArabic ? 'حفظ التعديلات' : 'Save Changes') 
            : (isArabic ? 'تعديل بيانات القيد' : 'Edit Customs Info')}
        </Button>
      </div>

      {/* Key Identifier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
        {/* ACID Number */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? 'رقم القيد الجمركي المسبق (ACID Number):' : 'Nafeza ACID Number:'}
          </label>
          {isEditing ? (
            <Input
              value={acidNumber}
              onChange={(e) => setAcidNumber(e.target.value)}
              className="text-sm font-mono h-8 bg-white dark:bg-slate-800"
            />
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {acidNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(acidNumber, 'acid')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Copy ACID"
              >
                {copiedField === 'acid' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {isArabic ? 'معتمد عبر منصة نافذة' : 'Verified via Nafeza Egypt'}
          </span>
        </div>

        {/* Port of Entry */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? 'ميناء الوصول والتخليص:' : 'Port of Entry:'}
          </label>
          {isEditing ? (
            <select
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2"
            >
              {EGYPTIAN_PORTS.map(p => (
                <option key={p.value} value={p.value}>
                  {isArabic ? p.labelAr : p.labelEn}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-sm">
              <Anchor className="w-4 h-4 text-blue-500" />
              <span>
                {EGYPTIAN_PORTS.find(p => p.value === selectedPort)?.[isArabic ? 'labelAr' : 'labelEn']}
              </span>
            </div>
          )}
          <span className="text-[10px] text-slate-400 mt-1 block">
            {isArabic ? 'حاوية 40 قدم عالية السعة (FCL)' : '1x 40ft High Cube FCL'}
          </span>
        </div>

        {/* Bill of Lading (B/L) */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {isArabic ? 'بوليصة الشحن (Bill of Lading):' : 'Bill of Lading (B/L):'}
          </label>
          {isEditing ? (
            <Input
              value={blNumber}
              onChange={(e) => setBlNumber(e.target.value)}
              className="text-sm font-mono h-8 bg-white dark:bg-slate-800"
            />
          ) : (
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {blNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(blNumber, 'bl')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                title="Copy B/L"
              >
                {copiedField === 'bl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
          <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 font-medium">
            <Ship className="w-3 h-3" />
            {initialCarrier}
          </span>
        </div>
      </div>

      {/* Visual Clearance Timeline */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {isArabic ? 'مراحل الإفراج الجمركي والمطابقة:' : 'Customs Clearance Progress:'}
        </h4>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
            {CUSTOMS_STAGES.map((stage, idx) => {
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stage.id}
                  onClick={() => isEditing && setCurrentStage(stage.id)}
                  className={cn(
                    "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center",
                    isEditing ? "cursor-pointer hover:border-blue-400" : "",
                    isCurrent
                      ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm"
                      : isPassed
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold text-xs",
                    isCurrent
                      ? "bg-blue-600 text-white animate-pulse"
                      : isPassed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  )}>
                    {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>

                  <span className="font-bold text-xs leading-tight mb-1 block">
                    {isArabic ? stage.labelAr : stage.labelEn}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {isArabic ? stage.descAr : stage.descEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>
            {isArabic 
              ? 'ضمان مرسى: لا يتم تحويل دفعة المصنع المتبقية (70%) إلا بعد اجتياز فحص الجمارك والرقابة على الصادرات والواردات.'
              : 'Marsa Escrow Guarantee: Remaining 70% balance is released only after passing customs and GOEIC clearance.'}
          </span>
        </div>

        <a
          href="https://www.nafeza.gov.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 font-medium"
        >
          <span>{isArabic ? 'بوابة نافذة الحكومية' : 'Nafeza Portal'}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
