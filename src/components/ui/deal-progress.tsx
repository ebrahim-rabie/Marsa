import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DealProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStage: number; // 1 to 7
  locale?: 'en' | 'ar';
}

const stages = {
  en: ['Inquiry', 'Quote', 'Samples', 'Negotiation', 'Contract', 'Production', 'Logistics'],
  ar: ['استفسار', 'تسعير', 'عينات', 'تفاوض', 'عقد', 'إنتاج', 'لوجستيات'],
};

/**
 * 7-step progress bar for the deal journey.
 */
export function DealProgress({
  currentStage,
  locale = 'en',
  className,
  ...props
}: DealProgressProps) {
  const stageLabels = stages[locale];

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-3 start-0 end-0 h-1 bg-[#D2DDDB] -z-10" />
        
        {/* Progress line */}
        <div 
          className="absolute top-3 start-0 h-1 bg-[#0F4C5C] -z-10 transition-all duration-500 ease-in-out"
          style={{ width: `${Math.max(0, ((currentStage - 1) / (7 - 1)) * 100)}%` }}
        />

        {stageLabels.map((label, index) => {
          const step = index + 1;
          const isCompleted = step < currentStage;
          const isCurrent = step === currentStage;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-300',
                  isCompleted ? 'bg-[#0F4C5C] border-[#0F4C5C]' : 
                  isCurrent ? 'bg-[#F2B01E] border-[#F2B01E] shadow-sm' : 
                  'bg-white border-[#D2DDDB]'
                )}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span 
                className={cn(
                  'text-[10px] sm:text-xs font-medium text-center hidden sm:block',
                  isCurrent ? 'text-[#0A2F38] font-bold' : 'text-[#465A60]'
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Current Stage Label */}
      <div className="mt-3 text-center sm:hidden">
        <span className="text-sm font-semibold text-[#0A2F38]">
          {stageLabels[currentStage - 1]}
        </span>
      </div>
    </div>
  );
}
