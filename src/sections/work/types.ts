import { useLanguage } from '@/hooks/useLanguage';
import { siteContent } from '@/data/content';

export interface WorkAsset {
  title: string;
  type: string;
  pages?: string;
  pdfUrl?: string | null;
  imageGallery?: readonly string[];
}

export interface WorkProject {
  id: string;
  title: string;
  subtitle: string;
  categories: readonly ProjectCategory[];
  categoryLabel: CategoryLabel;
  image: string;
  previewImages: readonly string[];
  sampleImages?: readonly string[];
  externalUrl?: string;
  pdfUrl?: string | null;
  whatsappMessage?: string;
  year: string;
  role: string;
  scope: string;
  format: string;
  lectureCount?: string;
  collection?: boolean;
  isMajor?: boolean;
  collectionSummary?: string;
  metrics?: readonly { label: string; value: string }[];
  assets?: readonly WorkAsset[];
}

export type Category = (typeof siteContent.work.filters)[number]['value'];
export type ProjectCategory = Exclude<Category, 'all'>;
export type CategoryLabel = keyof typeof siteContent.work.copy.en.categories;
export type WorkCopy = {
  library: string;
  heading: string;
  intro: string;
  majorLabel: string;
  majorHeading: string;
  majorCount: string;
  standardLabel: string;
  standardHeading: string;
  standardCount: string;
  currentProject: string;
  statusCurrent: string;
  projectName: string;
  lectureCount: string;
  date: string;
  files: string;
  close: string;
  view: string;
  hideFiles: string;
  viewFiles: string;
  requestSimilar: string;
  filters: Record<string, string>;
  categories: Record<string, string>;
};
export type ViewablePdf = { title: string; pdfUrl: string };

export interface WorkSectionProps {
  lang: ReturnType<typeof useLanguage>;
}
