import { PrintableDocument, type DocumentType } from '@/components/features/documents/printable-document';

interface DocumentPageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function DocumentViewerPage({ params, searchParams }: DocumentPageProps) {
  const { locale, id } = await params;
  const { type } = await searchParams;

  const validTypes: DocumentType[] = ['po', 'proforma', 'escrow'];
  const docType = (type && validTypes.includes(type as DocumentType)) ? (type as DocumentType) : 'po';

  return (
    <PrintableDocument
      documentType={docType}
      orderNumber={id}
      locale={locale}
    />
  );
}
