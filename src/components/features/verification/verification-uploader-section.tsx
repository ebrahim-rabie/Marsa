'use client';

import { useState } from 'react';
import { FileUploader, type UploadedFileItem } from '@/components/ui/file-uploader';

interface VerificationUploaderSectionProps {
  label: string;
  description?: string;
  locale: string;
}

export function VerificationUploaderSection({
  label,
  description,
  locale,
}: VerificationUploaderSectionProps) {
  const isAr = locale === 'ar';
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: 'init-doc-1',
      name: 'Business_License_2026.pdf',
      size: 1450200,
      url: '#',
      type: 'application/pdf',
      uploadedAt: 'Aug 15, 2026',
    },
  ]);

  return (
    <div className="mt-3">
      <FileUploader
        label={label}
        description={description}
        initialFiles={files}
        onFilesChange={setFiles}
        locale={locale}
      />
    </div>
  );
}
