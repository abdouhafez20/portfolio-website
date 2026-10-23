import { useState } from 'react';
import PDFModal from '@/components/PDFModal';
import SampleGallery from '@/components/SampleGallery';

export interface ViewableAsset {
  title: string;
  pdfUrl?: string | null;
  imageGallery?: readonly string[];
  flipbookUrl?: string;
}

export function useAssetViewer() {
  const [modalItem, setModalItem] = useState<{ title: string; pdfUrl: string } | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const [galleryEmbedUrl, setGalleryEmbedUrl] = useState<string | null>(null);
  const [galleryTitle, setGalleryTitle] = useState<string | undefined>(undefined);
  const [galleryShowNotice, setGalleryShowNotice] = useState<boolean>(false);
  const [galleryOnRequest, setGalleryOnRequest] = useState<(() => void) | null>(null);

  const closeAll = () => {
    setModalItem(null);
    setGalleryImages(null);
    setGalleryEmbedUrl(null);
    setGalleryTitle(undefined);
    setGalleryShowNotice(false);
    setGalleryOnRequest(null);
  };

  const openPdf = (title: string, pdfUrl: string) => {
    setGalleryImages(null);
    setGalleryEmbedUrl(null);
    setModalItem({ title, pdfUrl });
  };

  const openGallery = (
    images: string[],
    title?: string,
    onRequest?: () => void,
    showNotice = false,
  ) => {
    setModalItem(null);
    setGalleryEmbedUrl(null);
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryShowNotice(showNotice);
    setGalleryOnRequest(onRequest ? () => onRequest : null);
  };

  const openEmbed = (embedUrl: string, title?: string) => {
    setModalItem(null);
    setGalleryImages([]);
    setGalleryEmbedUrl(embedUrl);
    setGalleryTitle(title);
    setGalleryShowNotice(false);
    setGalleryOnRequest(null);
  };

  const openAsset = (asset: ViewableAsset, fallbackTitle?: string) => {
    const title = asset.title || fallbackTitle || '';

    if (asset.flipbookUrl) {
      openEmbed(asset.flipbookUrl, title);
      return;
    }

    if (asset.pdfUrl) {
      openPdf(title, asset.pdfUrl);
      return;
    }

    if (asset.imageGallery && asset.imageGallery.length > 0) {
      openGallery([...asset.imageGallery], title);
      return;
    }
  };

  const ViewerComponent = () => (
    <>
      {modalItem && modalItem.pdfUrl && (
        <PDFModal
          title={modalItem.title}
          src={modalItem.pdfUrl}
          onClose={() => setModalItem(null)}
        />
      )}
      {(galleryImages !== null || galleryEmbedUrl !== null) && (
        <SampleGallery
          images={galleryImages ?? []}
          embedUrl={galleryEmbedUrl ?? undefined}
          title={galleryTitle}
          onClose={() => {
            setGalleryImages(null);
            setGalleryEmbedUrl(null);
          }}
          showNotice={galleryShowNotice}
          onRequest={galleryOnRequest ?? undefined}
        />
      )}
    </>
  );

  return {
    openPdf,
    openGallery,
    openEmbed,
    openAsset,
    closeAll,
    ViewerComponent,
  };
}
