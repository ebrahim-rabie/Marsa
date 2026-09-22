'use client';

import { Printer, Download, ShieldCheck, ArrowLeft, Building2, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type DocumentType = 'po' | 'proforma' | 'escrow';

interface PrintableDocumentProps {
  documentType: DocumentType;
  orderNumber: string;
  orderDate?: string;
  buyerName?: string;
  buyerCompany?: string;
  buyerTaxId?: string;
  supplierName?: string;
  supplierCompany?: string;
  supplierCountry?: string;
  productName?: string;
  specifications?: string;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  currency?: string;
  incoterm?: string;
  acidNumber?: string;
  escrowDepositPaid?: boolean;
  locale: string;
}

export function PrintableDocument({
  documentType,
  orderNumber,
  orderDate = new Date().toISOString().split('T')[0],
  buyerName = 'Ahmed Hassan',
  buyerCompany = 'Cairo Import & Trading Co. (شركة القاهرة للاستيراد)',
  buyerTaxId = 'EG-TR-4920194',
  supplierName = 'Li Wei',
  supplierCompany = 'Shanghai Packaging & Industrial Co. Ltd.',
  supplierCountry = 'China (CN)',
  productName = 'أكياس تعبئة وتغليف معيارية مخصصة (Custom Food Grade Packaging Bags)',
  specifications = 'Multi-layer barrier film, matte finish, zip lock, food-grade certified ISO 22000.',
  quantity = 100000,
  unitPrice = 0.045,
  totalAmount = 4500,
  currency = 'USD',
  incoterm = 'FOB Shanghai',
  acidNumber = '4920-8194-0194-8210',
  escrowDepositPaid = true,
  locale,
}: PrintableDocumentProps) {
  const isArabic = locale === 'ar';

  const docTitles: Record<DocumentType, { ar: string; en: string; code: string }> = {
    po: {
      ar: 'أمر توريد تجاري رقمي معتمد (Digital Purchase Order)',
      en: 'Official Commercial Purchase Order (PO)',
      code: `PO-${orderNumber}`,
    },
    proforma: {
      ar: 'فاتورة مبدئية معتمدة للأغراض البنكية والجمارك (Proforma Invoice)',
      en: 'Proforma Commercial Invoice (PI)',
      code: `PI-${orderNumber}`,
    },
    escrow: {
      ar: 'شهادة إيداع وضمان بنكي مشروط (Escrow Deposit Certificate)',
      en: 'Irrevocable Escrow Deposit & Guarantee Certificate',
      code: `ESC-${orderNumber}`,
    },
  };

  const currentDoc = docTitles[documentType];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn("min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 print:bg-white print:p-0", isArabic ? "font-cairo" : "")}>
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/${locale}/dashboard/orders/${orderNumber}`}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className={cn("w-4 h-4", isArabic && "rotate-180")} />
          <span>{isArabic ? 'العودة لتتبع الطلب' : 'Back to Order Details'}</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Document Switcher */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 text-xs flex gap-1">
            <Link
              href={`/${locale}/dashboard/orders/${orderNumber}/document?type=po`}
              className={cn("px-2.5 py-1 rounded-md transition-colors", documentType === 'po' ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300")}
            >
              {isArabic ? 'أمر التوريد (PO)' : 'Purchase Order'}
            </Link>
            <Link
              href={`/${locale}/dashboard/orders/${orderNumber}/document?type=proforma`}
              className={cn("px-2.5 py-1 rounded-md transition-colors", documentType === 'proforma' ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300")}
            >
              {isArabic ? 'فاتورة مبدئية (PI)' : 'Proforma'}
            </Link>
            <Link
              href={`/${locale}/dashboard/orders/${orderNumber}/document?type=escrow`}
              className={cn("px-2.5 py-1 rounded-md transition-colors", documentType === 'escrow' ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300")}
            >
              {isArabic ? 'شهادة الضمان' : 'Escrow Certificate'}
            </Link>
          </div>

          <Button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isArabic ? 'طباعة / حفظ كـ PDF' : 'Print / Save PDF'}</span>
          </Button>
        </div>
      </div>

      {/* Main Printable A4 Page */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-extrabold text-2xl tracking-tight text-emerald-800 font-sans">
                MARSA <span className="text-amber-600 font-cairo">مرسى</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Verified B2B Escrow Trade
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Marsa Cross-Border Sourcing Platform (Egypt 🇪🇬 ⟷ China 🇨🇳)  
              Cairo: Smart Village, Giza | Shanghai: Pudong Trade Zone  
              Web: marsa.trade | Support: trade@marsa.trade
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {isArabic ? currentDoc.ar : currentDoc.en}
            </h1>
            <p className="font-mono text-sm font-bold text-emerald-700 mt-1">
              Doc Ref: {currentDoc.code}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Issue Date: {orderDate}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Nafeza ACID: {acidNumber}
            </p>
          </div>
        </div>

        {/* Counterparty Information */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-slate-200 text-xs">
          {/* Buyer */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{isArabic ? 'بيانات المشتري / المستورد (Buyer):' : 'Buyer / Importer Information:'}</span>
            </h3>
            <p className="font-bold text-slate-900 text-sm">{buyerCompany}</p>
            <p className="text-slate-600 mt-1">Contact: {buyerName}</p>
            <p className="text-slate-600">Tax Reg: {buyerTaxId}</p>
            <p className="text-slate-600">Country: Egypt 🇪🇬 (Cairo/Alexandria)</p>
          </div>

          {/* Supplier */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isArabic ? 'بيانات المصنع / المورد (Supplier):' : 'Supplier / Factory Information:'}</span>
            </h3>
            <p className="font-bold text-slate-900 text-sm">{supplierCompany}</p>
            <p className="text-slate-600 mt-1">Authorized Rep: {supplierName}</p>
            <p className="text-slate-600">Origin Country: {supplierCountry}</p>
            <p className="text-slate-600">Verification Level: Level 3 (On-Site Audited)</p>
          </div>
        </div>

        {/* Product & Contract Specifications */}
        <div className="mb-8">
          <h3 className="font-bold text-sm text-slate-900 mb-3">
            {isArabic ? 'تفاصيل البضاعة والمواصفات الفنية المعتمدة:' : 'Item Specifications & Commercial Terms:'}
          </h3>

          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">{isArabic ? 'وصف المنتج / المواصفات' : 'Product & Tech Specs'}</th>
                <th className="p-3 text-center">{isArabic ? 'الكمية' : 'Quantity'}</th>
                <th className="p-3 text-right">{isArabic ? 'سعر الوحدة' : 'Unit Price'}</th>
                <th className="p-3 text-right">{isArabic ? 'الإجمالي' : 'Total'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3 font-mono">01</td>
                <td className="p-3">
                  <p className="font-bold text-slate-900">{productName}</p>
                  <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">{specifications}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      Incoterm: {incoterm}
                    </span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      ACID: {acidNumber}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center font-mono font-bold">
                  {quantity.toLocaleString()} pcs
                </td>
                <td className="p-3 text-right font-mono">
                  ${unitPrice} {currency}
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ${totalAmount.toLocaleString()} {currency}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={4} className="p-3 text-right">
                  {isArabic ? 'إجمالي قيمة العقد التجاري:' : 'Total Contract Value:'}
                </td>
                <td className="p-3 text-right font-mono text-sm text-emerald-800">
                  ${totalAmount.toLocaleString()} {currency}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Escrow Milestone Breakdown */}
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isArabic ? 'جدول الدفع المشروط (Marsa Conditional Escrow Schedule):' : 'Staged Escrow Milestone Schedule:'}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-xs">
                {isArabic ? 'الدفعة الأولى (30% مقدم تعاقد):' : 'Milestone 1 (30% Upfront Deposit):'}
              </span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">
                ${(totalAmount * 0.3).toLocaleString()} {currency}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                {escrowDepositPaid 
                  ? (isArabic ? 'مدفوعة ومجمدة في حساب الضمان المشروط' : 'Funded & Secured in Escrow')
                  : 'Pending Buyer Deposit'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-xs">
                {isArabic ? 'الدفعة النهائية (70% متبقي العقد):' : 'Milestone 2 (70% Final Balance):'}
              </span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">
                ${(totalAmount * 0.7).toLocaleString()} {currency}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {isArabic ? 'تُفرج بعد الفحص الميداني واجتياز الجمارك المصرية' : 'Released upon GOEIC inspection & customs clearance'}
              </span>
            </div>
          </div>
        </div>

        {/* Stamp & Signatures */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-3 gap-6 items-end text-xs">
          {/* Buyer Signature */}
          <div className="text-center">
            <p className="text-slate-500 mb-10">{isArabic ? 'توقيع واعتماد المشتري' : 'Buyer Authorized Signature'}</p>
            <div className="h-0.5 bg-slate-300 w-32 mx-auto mb-1" />
            <span className="font-bold text-slate-700">{buyerCompany}</span>
          </div>

          {/* Marsa Escrow Stamp */}
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-2 rotate-[-6deg] bg-emerald-50/50 mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-tighter mt-0.5">
                MARSA ESCROW
              </span>
              <span className="text-[7px] text-emerald-600">OFFICIALLY SECURED</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Verification Key: MRS-SEC-89410</span>
          </div>

          {/* Supplier Signature */}
          <div className="text-center">
            <p className="text-slate-500 mb-10">{isArabic ? 'ختم وتوقيع المصنع' : 'Factory Stamp & Seal'}</p>
            <div className="h-0.5 bg-slate-300 w-32 mx-auto mb-1" />
            <span className="font-bold text-slate-700">{supplierCompany}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
