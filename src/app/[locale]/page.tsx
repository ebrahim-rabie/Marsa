import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export default function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#F3F7F6] text-[#0A2F38]">
      
      {/* 1. Hero Section */}
      <section className="bg-[#0F4C5C] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <svg viewBox="4 24 92 72" className="h-16 w-auto text-white">
              <path fill="currentColor" d="M10 90V30h80v60H76V44H57v46H43V44H24v46z"/>
              <rect x="57" y="44" width="19" height="46" fill="#F2B01E"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight mx-auto max-w-4xl" dir="auto">
            {isAr 
              ? <bdi>بتستورد من الصين؟ هات عروض من مصانع متحققة، وشحنتك توصل مخزنك بأمان.</bdi>
              : 'Buying from China? Get quotes from verified factories, and a safe path to your warehouse.'}
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto" dir="auto">
            {isAr
              ? <bdi>مرسى بيتحقق من المورد، بيحمي الدفع، وبيتابع الشحنة لحد ما توصل.</bdi>
              : 'Marsa checks the supplier, protects your payment, and follows the shipment until it arrives.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${locale}/request/new`}
              className="bg-[#F2B01E] text-[#0A2F38] px-8 py-4 rounded-md font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg"
            >
              {isAr ? 'ابعت طلب شراء' : 'Send a buy request'}
            </Link>
            <Link 
              href={`/${locale}#how-it-works`}
              className="bg-white/10 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white/20 transition-colors"
            >
              {isAr ? 'اعرف إزاي بنشتغل' : 'See how it works'}
            </Link>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 start-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 start-10 w-64 h-64 bg-[#F2B01E] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 end-10 w-96 h-96 bg-[#1B7A50] rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* 2. The 7-Step Deal Journey */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F4C5C] mb-4">
            {isAr ? 'من الطلب إلى المرسى' : 'From request to receipt'}
          </h2>
          <div className="flex items-center justify-center gap-6 text-sm text-[#465A60]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F2B01E]"></span>
              <span>{isAr ? 'بإدارة مرسى' : 'Marsa Controls'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-[#465A60]"></span>
              <span>{isAr ? 'المشتري/الشريك' : 'Buyer/Partner'}</span>
            </div>
          </div>
        </div>

        {/* Timeline Desktop */}
        <div className="relative hidden md:block">
          <div className="absolute top-6 start-0 w-full h-1 bg-[#465A60]/20 rounded-full"></div>
          <div className="grid grid-cols-7 gap-4 relative z-10">
            {[
              { num: 1, type: 'outline', title: isAr ? 'طلب الشراء' : 'Buy request', desc: isAr ? 'بتحدد اللي محتاجه' : 'Define your needs' },
              { num: 2, type: 'yellow', title: isAr ? 'عروض موثّقة' : 'Verified quotes', desc: isAr ? 'من مصانع حقيقية' : 'From real factories' },
              { num: 3, type: 'yellow', title: isAr ? 'عينة وتحقق' : 'Sample & checks', desc: isAr ? 'نتأكد من الجودة' : 'Ensure quality' },
              { num: 4, type: 'yellow', title: isAr ? 'دفع على مراحل' : 'Staged payment', desc: isAr ? 'فلوسك في أمان' : 'Secure funds' },
              { num: 5, type: 'outline', title: isAr ? 'فحص قبل الشحن' : 'Pre-ship inspection', desc: isAr ? 'عن طريق شريك' : 'Via partner' },
              { num: 6, type: 'outline', title: isAr ? 'شحن وتخليص' : 'Shipping', desc: isAr ? 'لحد باب المخزن' : 'To your warehouse' },
              { num: 7, type: 'yellow', title: isAr ? 'استلام وتقييم' : 'Receipt & review', desc: isAr ? 'صفقة تمت بنجاح' : 'Deal done' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 bg-white transition-transform group-hover:scale-110
                  ${step.type === 'yellow' ? 'border-4 border-[#F2B01E] text-[#0A2F38]' : 'border-2 border-[#465A60] text-[#465A60]'}
                `} style={{ numberingSystem: 'latn' }}>
                  {step.num}
                </div>
                <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-[#465A60]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Mobile */}
        <div className="md:hidden flex flex-col gap-8 relative border-s-2 border-[#465A60]/20 ps-6 ms-4">
            {[
              { num: 1, type: 'outline', title: isAr ? 'طلب الشراء' : 'Buy request', desc: isAr ? 'بتحدد اللي محتاجه' : 'Define your needs' },
              { num: 2, type: 'yellow', title: isAr ? 'عروض موثّقة' : 'Verified quotes', desc: isAr ? 'من مصانع حقيقية' : 'From real factories' },
              { num: 3, type: 'yellow', title: isAr ? 'عينة وتحقق' : 'Sample & checks', desc: isAr ? 'نتأكد من الجودة' : 'Ensure quality' },
              { num: 4, type: 'yellow', title: isAr ? 'دفع على مراحل' : 'Staged payment', desc: isAr ? 'فلوسك في أمان' : 'Secure funds' },
              { num: 5, type: 'outline', title: isAr ? 'فحص قبل الشحن' : 'Pre-ship inspection', desc: isAr ? 'عن طريق شريك' : 'Via partner' },
              { num: 6, type: 'outline', title: isAr ? 'شحن وتخليص' : 'Shipping', desc: isAr ? 'لحد باب المخزن' : 'To your warehouse' },
              { num: 7, type: 'yellow', title: isAr ? 'استلام وتقييم' : 'Receipt & review', desc: isAr ? 'صفقة تمت بنجاح' : 'Deal done' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -start-[42px] top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-[#F3F7F6]
                  ${step.type === 'yellow' ? 'border-4 border-[#F2B01E] text-[#0A2F38]' : 'border-2 border-[#465A60] text-[#465A60]'}
                `} style={{ numberingSystem: 'latn' }}>
                  {step.num}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{step.title}</h4>
                  <p className="text-[#465A60]">{step.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 3. Three Pillars Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-xl bg-[#F3F7F6] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#0F4C5C]/10 rounded-lg flex items-center justify-center text-[#0F4C5C] mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{isAr ? 'سوق مُدار مش دليل' : 'A managed marketplace, not a directory'}</h3>
              <p className="text-[#465A60] leading-relaxed">
                {isAr ? 'الصفقة بتبدأ وبتخلص على المنصة، بسجل وبحماية كاملة من أول رسالة لحد التسليم.' : 'The deal starts and finishes on the platform, with a full record and protection.'}
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="p-8 rounded-xl bg-[#F3F7F6] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#F2B01E]/20 rounded-lg flex items-center justify-center text-[#F2B01E] mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{isAr ? 'مقارنة مصري وصيني' : 'Egyptian and Chinese quotes'}</h3>
              <p className="text-[#465A60] leading-relaxed">
                {isAr ? 'شوف العروض بنفس الشروط في جدول واحد، وقرر الأنسب ليك من حيث السعر والوقت.' : 'See quotes under the same terms in one table, and decide what fits best.'}
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-xl bg-[#F3F7F6] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#1B7A50]/10 rounded-lg flex items-center justify-center text-[#1B7A50] mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{isAr ? 'تقييمات من صفقات حقيقية بس' : 'Reviews from real deals only'}</h3>
              <p className="text-[#465A60] leading-relaxed">
                {isAr ? 'محدش بيقيّم غير اللي أتم صفقة. والترتيب مش للبيع، الثقة مبنية على التجربة.' : 'Only those who completed a deal can review. Rankings are not for sale.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trust Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0F4C5C] mb-6">
              {isAr ? 'الثقة هي المنتج الأساسي' : 'Trust is the product'}
            </h2>
            <p className="text-[#465A60] text-lg mb-8 leading-relaxed">
              {isAr 
                ? 'احنا مش بنعرض أي مورد وخلاص. كل مورد على مرسى بيمر بمستويات تحقق عشان تضمن حقك وجودة البضاعة.'
                : 'We don\'t list just any supplier. Every supplier on Marsa goes through verification levels so you can guarantee your rights and product quality.'}
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <span className="mt-1 px-2 py-1 text-xs font-bold rounded bg-gray-200 text-gray-700 whitespace-nowrap">Level 1</span>
                <div>
                  <h4 className="font-bold mb-1">{isAr ? 'مسجّل (Registered)' : 'Registered'}</h4>
                  <p className="text-sm text-[#465A60]">{isAr ? 'تم التحقق من السجل التجاري والبيانات الأساسية.' : 'Business registration and basic data verified.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 px-2 py-1 text-xs font-bold rounded bg-[#F2B01E]/20 text-[#0F4C5C] whitespace-nowrap">Level 2</span>
                <div>
                  <h4 className="font-bold mb-1 flex items-center gap-2">
                    {isAr ? 'متحقق بالفيديو (Video-verified)' : 'Video-verified'}
                    <svg className="w-4 h-4 text-[#F2B01E]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </h4>
                  <p className="text-sm text-[#465A60]">{isAr ? 'تم التحقق من المصنع عبر مكالمة فيديو مباشرة ومراجعة المعدات.' : 'Factory verified via live video call and equipment review.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 px-2 py-1 text-xs font-bold rounded bg-[#1B7A50]/20 text-[#1B7A50] whitespace-nowrap">Level 3</span>
                <div>
                  <h4 className="font-bold mb-1 flex items-center gap-2">
                    {isAr ? 'مدقّق (Audited)' : 'Audited'}
                    <svg className="w-4 h-4 text-[#1B7A50]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </h4>
                  <p className="text-sm text-[#465A60]">{isAr ? 'زيارة ميدانية وتدقيق شامل من طرف ثالث معتمد للقدرة الإنتاجية والجودة.' : 'On-site visit and comprehensive third-party audit for capacity and quality.'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[#0F4C5C]/5 rounded-2xl p-8 border border-[#0F4C5C]/10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
            {/* Visual representation of a supplier profile card */}
            <div className="bg-white p-6 rounded-xl shadow-lg relative z-10">
              <div className="flex items-center gap-4 mb-4 border-b pb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">🏭</div>
                <div>
                  <h5 className="font-bold">Guangzhou TechMakers Co.</h5>
                  <div className="flex items-center gap-2 text-xs text-[#1B7A50] mt-1 font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {isAr ? 'مورد مدقّق (Level 3)' : 'Audited Supplier (Level 3)'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-[#465A60]">Response Time</span><span className="font-bold">{'<'} 4h</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#465A60]">On-time Delivery</span><span className="font-bold">98%</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#465A60]">Completed Deals</span><span className="font-bold">12</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stats Section */}
      <section className="bg-[#0A2F38] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-white/10 rtl:divide-x-reverse">
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-[#F2B01E] mb-2" style={{ numberingSystem: 'latn' }}>47</div>
              <div className="text-white/80 font-medium">{isAr ? 'صفقة مكتملة' : 'Completed deals'}</div>
            </div>
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-[#F2B01E] mb-2" style={{ numberingSystem: 'latn' }}>38</div>
              <div className="text-white/80 font-medium">{isAr ? 'مورد متحقق' : 'Verified suppliers'}</div>
            </div>
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-[#F2B01E] mb-2" style={{ numberingSystem: 'latn' }}>{isAr ? '72 ساعة' : '72 hours'}</div>
              <div className="text-white/80 font-medium">{isAr ? 'متوسط وقت أول عرض' : 'Avg time to first quote'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[#0F4C5C] rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {isAr ? 'جاهز تبدأ؟ ابعت طلب الشراء الأول.' : 'Ready to start? Send your first buy request.'}
            </h2>
            <p className="text-white/80 mb-10 text-lg">
              {isAr ? 'سجل دلوقتي وخلينا نساعدك تلاقي أحسن الموردين لعملك.' : 'Register now and let us help you find the best suppliers for your business.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link 
                href={`/${locale}/request/new`}
                className="bg-[#F2B01E] text-[#0A2F38] px-10 py-4 rounded-md font-bold text-lg hover:bg-yellow-500 transition-colors w-full sm:w-auto"
              >
                {isAr ? 'ابعت طلب شراء' : 'Send a buy request'}
              </Link>
              <a 
                href="https://wa.me/201000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#F2B01E] transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {isAr ? 'أو كلمنا على واتساب' : 'Or contact us on WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
