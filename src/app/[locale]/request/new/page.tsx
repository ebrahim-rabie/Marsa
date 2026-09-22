'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { insertBuyRequest } from './actions'
import { CheckCircle2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const STEPS = 4

export default function BuyRequestForm() {
  const t = useTranslations('BuyRequestForm')
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [requestNumber, setRequestNumber] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    specifications: '',
    quantity: '',
    unit: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    supplierPreference: 'both',
    deliveryDate: '',
    notes: '',
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    source: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages(prev => [...prev, ...newFiles].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.productName && formData.category && formData.specifications
      case 2:
        return formData.quantity && formData.unit
      case 3:
        return true // All optional or have defaults
      case 4:
        return formData.fullName && formData.companyName && formData.phone
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep() && step < STEPS) {
      setStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    
    setIsSubmitting(true)
    try {
      const result = await insertBuyRequest(formData)
      if (result.success && result.requestNumber) {
        setRequestNumber(result.requestNumber)
        setIsSuccess(true)
      } else {
        // Handle error conceptually here
        console.error(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-sea-mist rounded-xl shadow-sm text-center">
        <CheckCircle2 className="w-16 h-16 text-verified-green mx-auto mb-4" />
        <h2 className="text-2xl font-reem-kufi font-bold text-deep-tide mb-2">
          {t('successTitle') || 'تم استلام طلبك!'}
        </h2>
        <p className="text-steel mb-6">
          {t('successMessage') || 'هنتواصل معاك خلال 24 ساعة.'}
        </p>
        <div className="bg-white p-4 rounded-lg mb-6 border border-gray-100">
          <p className="text-sm text-steel mb-1">رقم الطلب</p>
          <p className="font-bricolage font-bold text-xl text-harbor-petrol numbering-latn" dir="ltr">
            {requestNumber}
          </p>
        </div>
        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
          <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">
            {t('whatsappContact') || 'تواصل معنا على واتساب'}
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-harbor-petrol -z-10 -translate-y-1/2 transition-all duration-300"
            style={{ width: \`\${((step - 1) / (STEPS - 1)) * 100}%\` }}
          ></div>
          
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= i ? "bg-harbor-petrol text-white" : "bg-gray-200 text-gray-500"
              )}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* Step 1: Product Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-reem-kufi font-bold text-harbor-petrol mb-4">
              {t('step1Title') || 'تفاصيل المنتج'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">{t('productName') || 'اسم المنتج'} *</Label>
                <Input 
                  id="productName" 
                  name="productName" 
                  value={formData.productName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div>
                <Label>{t('category') || 'التصنيف'} *</Label>
                <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder={t('selectCategory') || 'اختر التصنيف'} />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="packaging">تعبئة وتغليف</SelectItem>
                    <SelectItem value="lighting">إضاءة</SelectItem>
                    <SelectItem value="spare_parts">قطع غيار</SelectItem>
                    <SelectItem value="electrical">كهربائيات</SelectItem>
                    <SelectItem value="textiles">منسوجات</SelectItem>
                    <SelectItem value="raw_materials">مواد خام</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specifications">{t('specifications') || 'المواصفات'} *</Label>
                <Textarea 
                  id="specifications" 
                  name="specifications" 
                  placeholder={t('specificationsPlaceholder') || 'اكتب المواصفات بالتفصيل: الخامة، المقاس، اللون...'} 
                  value={formData.specifications} 
                  onChange={handleInputChange} 
                  className="min-h-[100px]"
                  required 
                />
              </div>

              <div>
                <Label>{t('referenceImages') || 'صور مرجعية (اختياري - بحد أقصى 5 صور)'}</Label>
                <div className="mt-2 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">اضغط لرفع الصور</p>
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
                  <div className="flex flex-wrap gap-2 mt-4">
                    {images.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                        <img src={URL.createObjectURL(file)} alt="preview" className="object-cover w-full h-full" />
                        <button 
                          onClick={() => removeImage(idx)} 
                          className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-50"
                        >
                          <X className="w-3 h-3 text-alert-red" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Quantity & Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-reem-kufi font-bold text-harbor-petrol mb-4">
              {t('step2Title') || 'الكمية والميزانية'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">{t('quantity') || 'الكمية'} *</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number"
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  className="numbering-latn"
                  required 
                />
              </div>
              <div>
                <Label>{t('unit') || 'الوحدة'} *</Label>
                <Select value={formData.unit} onValueChange={(v) => handleSelectChange('unit', v)}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر الوحدة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="units">وحدة/قطعة</SelectItem>
                    <SelectItem value="kg">كيلوجرام</SelectItem>
                    <SelectItem value="meters">متر</SelectItem>
                    <SelectItem value="rolls">لفة/رول</SelectItem>
                    <SelectItem value="boxes">صندوق</SelectItem>
                    <SelectItem value="pallets">بالتة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Label>{t('budgetRange') || 'الميزانية المستهدفة (اختياري)'}</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input 
                    placeholder="الحد الأدنى" 
                    name="budgetMin" 
                    type="number"
                    value={formData.budgetMin} 
                    onChange={handleInputChange} 
                    className="numbering-latn"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="الحد الأقصى" 
                    name="budgetMax" 
                    type="number"
                    value={formData.budgetMax} 
                    onChange={handleInputChange} 
                    className="numbering-latn"
                  />
                </div>
                <div>
                  <Select value={formData.currency} onValueChange={(v) => handleSelectChange('currency', v)}>
                    <SelectTrigger dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="USD">دولار (USD)</SelectItem>
                      <SelectItem value="EGP">جنيه (EGP)</SelectItem>
                      <SelectItem value="CNY">يوان (CNY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-reem-kufi font-bold text-harbor-petrol mb-4">
              {t('step3Title') || 'التفضيلات وموعد التسليم'}
            </h2>

            <div>
              <Label className="mb-3 block">{t('supplierPreference') || 'تفضيل المورد'}</Label>
              <RadioGroup 
                value={formData.supplierPreference} 
                onValueChange={(v) => handleSelectChange('supplierPreference', v)}
                className="flex flex-col space-y-2"
                dir="rtl"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="both" id="sp-both" />
                  <Label htmlFor="sp-both">لا يوجد تفضيل (مصري أو صيني)</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="egyptian" id="sp-egyptian" />
                  <Label htmlFor="sp-egyptian">مورد مصري فقط</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="chinese" id="sp-chinese" />
                  <Label htmlFor="sp-chinese">مورد صيني فقط</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="deliveryDate">{t('deliveryDate') || 'موعد التسليم المتوقع'}</Label>
              <Input 
                id="deliveryDate" 
                name="deliveryDate" 
                type="date"
                value={formData.deliveryDate} 
                onChange={handleInputChange} 
              />
            </div>

            <div>
              <Label htmlFor="notes">{t('notes') || 'ملاحظات إضافية'}</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact Info */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-reem-kufi font-bold text-harbor-petrol mb-4">
              {t('step4Title') || 'بيانات التواصل'}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">{t('fullName') || 'الاسم بالكامل'} *</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="companyName">{t('companyName') || 'اسم الشركة'} *</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="phone">{t('phone') || 'رقم التليفون / واتساب'} *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  dir="ltr"
                  className="text-right"
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="email">{t('email') || 'البريد الإلكتروني (اختياري)'}</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  dir="ltr"
                  className="text-right"
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </div>

              <div>
                <Label>{t('source') || 'عرفتنا منين؟'}</Label>
                <Select value={formData.source} onValueChange={(v) => handleSelectChange('source', v)}>
                  <SelectTrigger dir="rtl">
                    <SelectValue placeholder="اختر..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="facebook">فيسبوك</SelectItem>
                    <SelectItem value="whatsapp">واتساب</SelectItem>
                    <SelectItem value="telegram">تليجرام</SelectItem>
                    <SelectItem value="friend">صديق/معرفة</SelectItem>
                    <SelectItem value="search">بحث جوجل</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={step === 1 || isSubmitting}
            className="text-steel"
          >
            {t('prev') || 'السابق'}
          </Button>
          
          {step < STEPS ? (
            <Button 
              onClick={handleNext} 
              disabled={!validateStep()}
              className="bg-harbor-petrol hover:bg-deep-tide text-white px-8"
            >
              {t('next') || 'التالي'}
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!validateStep() || isSubmitting}
              className="bg-signal-yellow hover:bg-yellow-500 text-deep-tide px-8 font-bold"
            >
              {isSubmitting ? 'جاري الإرسال...' : (t('submit') || 'إرسال الطلب')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
