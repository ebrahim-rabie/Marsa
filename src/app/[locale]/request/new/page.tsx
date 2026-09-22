'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { insertBuyRequest, type BuyRequestFormData } from './actions';
import { CheckCircle2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

const STEPS = 4;

const CATEGORY_OPTIONS = [
  { value: 'packaging', label: 'تعبئة وتغليف (Packaging)' },
  { value: 'lighting', label: 'إضاءة (Lighting)' },
  { value: 'spare_parts', label: 'قطع غيار وأدوات (Spare Parts)' },
  { value: 'electrical', label: 'مستلزمات كهربائية (Electrical)' },
  { value: 'textiles', label: 'منسوجات وأقمشة (Textiles)' },
  { value: 'raw_materials', label: 'مواد خام للمصانع (Raw Materials)' },
  { value: 'other', label: 'أخرى (Other)' },
];

const UNIT_OPTIONS = [
  { value: 'units', label: 'قطعة / وحدة (Units)' },
  { value: 'kg', label: 'كيلوجرام (Kg)' },
  { value: 'meters', label: 'متر (Meters)' },
  { value: 'rolls', label: 'لفة / رول (Rolls)' },
  { value: 'boxes', label: 'كرتونة / صندوق (Boxes)' },
  { value: 'pallets', label: 'بالتة (Pallets)' },
  { value: 'other', label: 'أخرى (Other)' },
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'دولار أمريكي (USD)' },
  { value: 'EGP', label: 'جنيه مصري (EGP)' },
  { value: 'CNY', label: 'يوان صيني (CNY)' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'اختر مصدر المعرفة...' },
  { value: 'facebook', label: 'مجموعات فيسبوك (Facebook)' },
  { value: 'whatsapp', label: 'جروب واتساب (WhatsApp)' },
  { value: 'telegram', label: 'قناة تليجرام (Telegram)' },
  { value: 'friend', label: 'ترشيح من صديق أو تاجر' },
  { value: 'search', label: 'بحث جوجل' },
  { value: 'other', label: 'أخرى' },
];

export default function BuyRequestForm() {
  const t = useTranslations('BuyRequestForm');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<BuyRequestFormData>({
    productName: '',
    category: 'packaging',
    specifications: '',
    quantity: '',
    unit: 'units',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    supplierPreference: 'both' as const,
    deliveryDate: '',
    notes: '',
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    source: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return Boolean(formData.productName.trim() && formData.category && formData.specifications.trim());
      case 2:
        return Boolean(formData.quantity.trim() && formData.unit);
      case 3:
        return true; // All preferences have defaults or are optional
      case 4:
        return Boolean(formData.fullName.trim() && formData.companyName.trim() && formData.phone.trim());
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep() && step < STEPS) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    try {
      const result = await insertBuyRequest(formData);
      if (result.success && result.requestNumber) {
        setRequestNumber(result.requestNumber);
        setIsSuccess(true);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#F3F7F6] rounded-2xl shadow-sm text-center border border-[#D2DDDB]">
        <CheckCircle2 className="w-16 h-16 text-[#1B7A50] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0F4C5C] mb-2 font-display">
          تم استلام طلب الشراء بنجاح!
        </h2>
        <p className="text-[#465A60] mb-6">
          سيقوم فريق العمل بفرز الطلب وترشيح 3 عروض أسعار موثّقة والتواصل معك خلال 24 ساعة.
        </p>
        <div className="bg-white p-4 rounded-xl mb-6 border border-[#D2DDDB]">
          <p className="text-xs text-[#465A60] mb-1">رقم طلب الشراء</p>
          <p className="font-bold text-2xl text-[#0F4C5C] font-mono" dir="ltr">
            {requestNumber}
          </p>
        </div>
        <a 
          href={`https://wa.me/201000000000?text=${encodeURIComponent(`مرحباً، أرسلت طلب شراء رقم ${requestNumber} وأود المتابعة.`)}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-[#1B7A50] hover:bg-[#15606F] text-white py-3 px-4 rounded-lg font-bold transition-colors"
        >
          متابعة الطلب عبر واتساب
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display text-[#0F4C5C] mb-2">
          طلب شراء جديد (RFQ)
        </h1>
        <p className="text-[#465A60] text-sm">
          احصل على عروض أسعار مقارنة من مصانع موثّقة في مصر والصين
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 start-0 end-0 h-1 bg-[#D2DDDB] -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 start-0 h-1 bg-[#0F4C5C] -z-10 -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((step - 1) / (STEPS - 1)) * 100}%` }}
          ></div>
          
          {[
            { num: 1, label: 'المنتج' },
            { num: 2, label: 'الكمية' },
            { num: 3, label: 'التفضيلات' },
            { num: 4, label: 'التواصل' }
          ].map(s => (
            <div key={s.num} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm",
                  step === s.num ? "bg-[#F2B01E] text-[#2E2200] ring-4 ring-[#E3EEED]" :
                  step > s.num ? "bg-[#0F4C5C] text-white" : "bg-white text-[#465A60] border border-[#D2DDDB]"
                )}
              >
                {s.num}
              </div>
              <span className="text-xs mt-1 font-medium text-[#465A60] hidden sm:block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#D2DDDB] p-6 md:p-8">
        {/* Step 1: Product Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#0F4C5C] mb-1">
                الخطوة 1: مواصفات المنتج
              </h2>
              <p className="text-xs text-[#465A60]">صف ما ترغب بشرائه بدقة للحصول على عروض مطابقة</p>
            </div>
            
            <Input 
              id="productName" 
              name="productName" 
              label="اسم المنتج المطلوب *"
              placeholder="مثال: عبوات كرتون مضلع 3 طبقات، أو ألواح إضاءة LED 60x60"
              value={formData.productName} 
              onChange={handleInputChange} 
              required 
            />

            <Select 
              id="category"
              label="فئة المنتج *"
              value={formData.category} 
              onChange={(e) => handleSelectChange('category', e.target.value)}
              options={CATEGORY_OPTIONS}
            />

            <Textarea 
              id="specifications" 
              name="specifications" 
              label="المواصفات الفنية المطلوبة *"
              placeholder="اكتب المواصفات بالتفصيل: الخامة، الأبعاد، الوزن، السماكة، اللون، متطلبات التغليف أو أي معايير جودة خاصة..." 
              value={formData.specifications} 
              onChange={handleInputChange} 
              rows={4}
              required 
            />

            <div>
              <label className="text-sm font-medium text-[#465A60] block mb-2">
                صور مرجعية أو رسومات توضيحية (اختياري - حتى 5 صور)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#D2DDDB] rounded-xl cursor-pointer hover:bg-[#F3F7F6] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <Upload className="w-6 h-6 text-[#465A60] mb-1" />
                    <p className="text-xs text-[#465A60]">اضغط لرفع صور العينة أو التصميم</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    disabled={images.length >= 5}
                  />
                </label>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-[#D2DDDB]">
                      <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)} 
                        className="absolute top-1 end-1 bg-white/90 rounded-full p-0.5 shadow-sm hover:bg-red-50"
                      >
                        <X className="w-3 h-3 text-[#B42318]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Quantity & Budget */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#0F4C5C] mb-1">
                الخطوة 2: الكمية والميزانية
              </h2>
              <p className="text-xs text-[#465A60]">تساعد الكمية المصانع على تقديم أفضل أسعار الجملة الممكنة</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                id="quantity" 
                name="quantity" 
                label="الكمية المطلوبة *"
                placeholder="مثال: 5000"
                type="number"
                value={formData.quantity} 
                onChange={handleInputChange} 
                required 
              />
              <Select 
                id="unit"
                label="وحدة القياس *"
                value={formData.unit} 
                onChange={(e) => handleSelectChange('unit', e.target.value)}
                options={UNIT_OPTIONS}
              />
            </div>

            <div className="pt-2">
              <label className="text-sm font-medium text-[#465A60] block mb-2">
                الميزانية الإجمالية التقديرية (اختياري)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input 
                  placeholder="الحد الأدنى" 
                  name="budgetMin" 
                  type="number"
                  value={formData.budgetMin} 
                  onChange={handleInputChange} 
                />
                <Input 
                  placeholder="الحد الأقصى" 
                  name="budgetMax" 
                  type="number"
                  value={formData.budgetMax} 
                  onChange={handleInputChange} 
                />
                <Select 
                  value={formData.currency} 
                  onChange={(e) => handleSelectChange('currency', e.target.value)}
                  options={CURRENCY_OPTIONS}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#0F4C5C] mb-1">
                الخطوة 3: التفضيلات وموعد التسليم
              </h2>
              <p className="text-xs text-[#465A60]">اختر ما يناسبك للمقارنة بين التوريد المحلي والاستيراد</p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#465A60] block mb-2.5">
                تفضيل مصدر التوريد
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { value: 'both', title: 'مقارنة (مصري وصيني)', desc: 'عروض من الجانبين للمفاضلة' },
                  { value: 'egyptian', title: 'مصري فقط', desc: 'توريد محلي أسرع ودفع بالجنيه' },
                  { value: 'chinese', title: 'صيني فقط', desc: 'استيراد مباشر من المصانع الصينية' },
                ].map(pref => (
                  <button
                    key={pref.value}
                    type="button"
                    onClick={() => handleSelectChange('supplierPreference', pref.value)}
                    className={cn(
                      "p-3.5 rounded-xl border text-start transition-all",
                      formData.supplierPreference === pref.value
                        ? "border-[#0F4C5C] bg-[#E3EEED] ring-2 ring-[#0F4C5C]/20"
                        : "border-[#D2DDDB] bg-white hover:bg-gray-50"
                    )}
                  >
                    <div className="font-semibold text-sm text-[#0F4C5C] mb-1">{pref.title}</div>
                    <div className="text-xs text-[#465A60]">{pref.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <Input 
              id="deliveryDate" 
              name="deliveryDate" 
              label="الموعد الأقصى لاستلام البضاعة (اختياري)"
              type="date"
              value={formData.deliveryDate} 
              onChange={handleInputChange} 
            />

            <Textarea 
              id="notes" 
              name="notes" 
              label="ملاحظات أو شروط خاصة"
              placeholder="أي تعليمات خاصة بشأن العينات، شروط الدفع، أو متطلبات الفحص قبل الشحن..."
              value={formData.notes} 
              onChange={handleInputChange} 
              rows={3}
            />
          </div>
        )}

        {/* Step 4: Contact Info */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold font-display text-[#0F4C5C] mb-1">
                الخطوة 4: بيانات التواصل
              </h2>
              <p className="text-xs text-[#465A60]">سنستخدم هذه البيانات لإرسال جدول مقارنة عروض الأسعار والتنسيق معك</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                id="fullName" 
                name="fullName" 
                label="الاسم الكريم *"
                placeholder="أحمد محمود"
                value={formData.fullName} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                id="companyName" 
                name="companyName" 
                label="اسم الشركة / النشاط التجاري *"
                placeholder="شركة النور للتجارة والتوزيع"
                value={formData.companyName} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                id="phone" 
                name="phone" 
                label="رقم الهاتف المحمول (واتساب فعال) *"
                placeholder="01012345678"
                type="tel"
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
              />
              <Input 
                id="email" 
                name="email" 
                label="البريد الإلكتروني (اختياري)"
                placeholder="name@company.com"
                type="email"
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>

            <Select 
              id="source"
              label="كيف تعرفت على منصة مرسى؟"
              value={formData.source} 
              onChange={(e) => handleSelectChange('source', e.target.value)}
              options={SOURCE_OPTIONS}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-5 border-t border-[#D2DDDB]">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={step === 1 || isSubmitting}
          >
            السابق
          </Button>
          
          {step < STEPS ? (
            <Button 
              variant="primary"
              onClick={handleNext} 
              disabled={!validateStep()}
            >
              متابعة
            </Button>
          ) : (
            <Button 
              variant="signal"
              onClick={handleSubmit} 
              disabled={!validateStep() || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب الشراء'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
