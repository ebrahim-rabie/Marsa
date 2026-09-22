'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  uploadedAt: string;
}

interface FileUploaderProps {
  label?: string;
  description?: string;
  acceptedTypes?: string[];
  maxSizeMb?: number;
  initialFiles?: UploadedFileItem[];
  onFilesChange?: (files: UploadedFileItem[]) => void;
  locale?: string;
}

export function FileUploader({
  label,
  description,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxSizeMb = 10,
  initialFiles = [],
  onFilesChange,
  locale = 'ar',
}: FileUploaderProps) {
  const isArabic = locale === 'ar';
  const [files, setFiles] = useState<UploadedFileItem[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMsg(null);

    const newItems: UploadedFileItem[] = [];

    Array.from(incomingFiles).forEach(file => {
      // Validate file size
      if (file.size > maxSizeMb * 1024 * 1024) {
        setErrorMsg(
          isArabic
            ? `الملف ${file.name} يتجاوز الحد الأقصى (${maxSizeMb} ميجابايت).`
            : `File ${file.name} exceeds maximum allowed size (${maxSizeMb} MB).`
        );
        return;
      }

      // Generate object URL for local sandbox preview
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: file.size,
        url: previewUrl,
        type: file.type,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    if (newItems.length > 0) {
      const updated = [...files, ...newItems];
      setFiles(updated);
      onFilesChange?.(updated);
    }
  };

  const removeFile = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  return (
    <div className={cn("space-y-3", isArabic ? "font-cairo" : "")}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          isDragging
            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
            : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-900/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {isArabic 
            ? 'اسحب وأفلت الملفات هنا أو اضغط للاختيار من جهازك' 
            : 'Drag and drop files here or click to browse'}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description || (isArabic 
            ? `الصيغ المدعومة: PDF, JPG, PNG (بحد أقصى ${maxSizeMb}MB للملف)`
            : `Supported formats: PDF, JPG, PNG (Max ${maxSizeMb}MB per file)`)}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isArabic ? `المستندات المرفقة (${files.length}):` : `Attached Files (${files.length}):`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => {
              const isPdf = file.name.endsWith('.pdf');
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      {isPdf ? <FileText className="w-4 h-4 text-rose-500" /> : <ImageIcon className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded"
                      title={isArabic ? 'حذف الملف' : 'Remove file'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
