# Wire All Sample Files & Canva Presentation Links

Connect every project's "View" action to its actual sample files (PDFs or image-folder galleries), add two Canva presentation deck links, and replace the Clinical Pathways card with the Neonatal Jaundice deck.

## Current State

### What exists on disk

| Content | Location | Type |
|---|---|---|
| Behavioral Science Lecture 01 | `/pdfs/behavioral-science-lecture-01.pdf` | PDF |
| Behavioral Science Lectures 02–16 | `/pdfs/behavioral-science-lecture-{02..16}/` (image folders, numbered .jpg) | Image gallery |
| Behavioral Science Revision 01 | `/pdfs/behavioral-science-revision-01/` (21 images) | Image gallery |
| Behavioral Science Revision 02 | `/pdfs/behavioral-science-revision-02/` (2 images: `ex-2-1.jpg`, `ex-2-2.jpg`) | Image gallery |
| PU Sample | `/pdfs/PU Sample - Dr Abdurrahman Hafez.pdf` | PDF |
| Immunity Sample | `/pdfs/immunity Sample - Dr Abdurrahman Hafez.pdf` | PDF |
| Al-Benaa Al-Manhaji | `/pdfs/al-benaa al-manjaji.pdf` | PDF |
| Internal Medicine — Genitourinary | `/pdfs/internal-medicine-genitourinary/` (9 images) | Image gallery |
| Internal Medicine — Hematology | `/pdfs/internal-medicine-hematology/` (8 images) | Image gallery |
| Internal Medicine — Neurology | `/pdfs/internal-medicine-neurology/` (15 images) | Image gallery |
| Internal Medicine — Respiratory | `/pdfs/internal-medicine-respiratory/` (20 images) | Image gallery |
| Resume | `/pdfs/resume.pdf` | PDF |
| Sample thumbnail folders | `/images/samples/{behavioral-science,internal-medicine,text-bank}/` (3 images each) | Thumbnails |
| Empty sample folders | `al-benaa, behavior-exam, clinical-pathways, immunity-sample, lecture-deck, pu-sample, study-summary` | **Empty** |

### Canva Presentation Decks (external)
1. **Chest Pain** → `https://aboutyasmeenalx.my.canva.site/chest-pain-dr-abdelrahman`
2. **Neonatal Jaundice** → `https://aboutyasmeenalx.my.canva.site/neonatal-jaundice`

---

## Proposed Changes

### Data Layer

#### [MODIFY] [content.ts](file:///d:/programming/Portfolio-1-main/src/data/content.ts)

**1. Add `externalUrl` field support to project data**
Projects with an external URL (Canva deck) will use a new optional `externalUrl` property. When set, clicking "View" opens this URL in a new tab instead of triggering the gallery or PDF viewer.

**2. Wire Behavioral Science assets (lectures 02–16)**
- Lectures 02–16: Each asset gets image gallery data pointing to `/pdfs/behavioral-science-lecture-{NN}/{1..N}.jpg`
- The existing lecture 01 already has its PDF wired — stays as-is
- Lectures 15–16 (previously labeled as lectures 15–16 but stored in lecture-15/lecture-16 folders): Wire these too
- Note: Currently the code generates 14 explanation assets + 14 Q-bank assets = 28. The actual folder structure has lectures 02–16 (15 folders for explanations) + 2 revision folders. I will update the assets array to match reality:
  - 16 Explanation lectures (01 = PDF, 02–16 = image galleries)
  - 2 Revision files (revision-01 = 21 images, revision-02 = 2 images)

**3. Wire Internal Medicine assets**
Replace placeholder `resume.pdf` references with real content:
- Genitourinary → image gallery from `/pdfs/internal-medicine-genitourinary/`
- Hematology → image gallery from `/pdfs/internal-medicine-hematology/`
- Neurology → image gallery from `/pdfs/internal-medicine-neurology/`
- Respiratory → image gallery from `/pdfs/internal-medicine-respiratory/`

**4. Wire standalone PDFs for standard projects**
- **PU Sample**: Set `pdfUrl` to `/pdfs/PU Sample - Dr Abdurrahman Hafez.pdf`
- **Immunity Sample**: Set `pdfUrl` to `/pdfs/immunity Sample - Dr Abdurrahman Hafez.pdf`
- **Al-Benaa Al-Manhaji**: Set `pdfUrl` to `/pdfs/al-benaa al-manjaji.pdf`

**5. Replace Clinical Pathways with Neonatal Jaundice presentation deck**
- Change the project to: title = "Neonatal Jaundice", externalUrl = Canva link, category = `presentations`

**6. Add Chest Pain Presentation as new project**
- title = "Chest Pain", externalUrl = Canva link, category = `presentations`

**7. Medical Lecture Deck → uses Chest Pain Canva link as externalUrl**
- Actually, re-reading the request: the user wants the two Canva links integrated. The "Chest Pain" is a presentation deck and the existing "Medical Lecture Deck" card is a good fit for it. The "Neonatal Jaundice" replaces "Clinical Pathways". So:
  - **Medical Lecture Deck** → set `externalUrl` to `https://aboutyasmeenalx.my.canva.site/chest-pain-dr-abdelrahman`
  - **Clinical Pathways** → replace with "Neonatal Jaundice" and set `externalUrl` to `https://aboutyasmeenalx.my.canva.site/neonatal-jaundice`

---

### Type Layer

#### [MODIFY] [types.ts](file:///d:/programming/Portfolio-1-main/src/sections/work/types.ts)

- Add `externalUrl?: string` to `WorkProject` interface
- Add `imageGallery?: readonly string[]` to `WorkAsset` interface (for image-folder assets that open in the SampleGallery instead of PDFModal)
- Add `pdfUrl?: string` to `WorkProject` interface for standard projects that should open a PDF directly

---

### Component Layer

#### [MODIFY] [WorkSection.tsx](file:///d:/programming/Portfolio-1-main/src/sections/WorkSection.tsx)

- When a standard project card is clicked to "View":
  - If `project.externalUrl` is set → open in new tab
  - If `project.pdfUrl` is set (new field for standalone PDF projects) → open PDFModal
  - If `project.sampleImages` has items → open SampleGallery (existing behavior)

#### [MODIFY] [StandardProjectCard.tsx](file:///d:/programming/Portfolio-1-main/src/sections/work/StandardProjectCard.tsx)

- Update "View" button label to "View Deck" for external URL projects with an `ExternalLink` icon
- For PDF-only projects (no sampleImages but has pdfUrl), the view action should open the PDF

#### [MODIFY] [MajorProjectCard.tsx](file:///d:/programming/Portfolio-1-main/src/sections/work/MajorProjectCard.tsx)

- When an asset has `imageGallery` instead of `pdfUrl`, the "View" button should open the SampleGallery with those images
- Pass a new callback `onViewGallery` for image-gallery assets

---

## Open Questions

> [!IMPORTANT]
> **Behavioral Science asset count**: The folder structure has 15 explanation lecture folders (02–16) + 1 PDF (01) = 16 total explanations, plus 2 revision folders. The current code declares 14 explanations + 14 Q-banks. Should I:
> - **(A)** Update to 16 explanations + 2 revisions (matches actual files on disk) — **recommended**
> - **(B)** Keep 14 explanations + 14 Q-banks and only wire what we can?

> [!IMPORTANT]
> **Empty sample thumbnail folders** (`al-benaa`, `behavior-exam`, `clinical-pathways`, `immunity-sample`, `lecture-deck`, `pu-sample`, `study-summary`): These folders under `/images/samples/` are empty. For projects that now have real PDFs (PU Sample, Immunity Sample, Al-Benaa), the "View" button will open the PDF directly. For the gallery thumbnails on the card, I'll use the existing cover images as preview. Is that acceptable?

> [!IMPORTANT]
> **Text Bank, Study Summary, Behavior Exam projects**: These have sample thumbnail images but no actual PDF or image-folder content to view. Currently they show 3 thumbnail images in the gallery. Should they stay as-is (gallery of 3 thumbnails)?

## Verification Plan

### Manual Verification
- Run `npm run dev` and test every project card:
  - Behavioral Science → expand files → each lecture view button should open gallery or PDF
  - Internal Medicine → expand files → each chapter view button should open image gallery
  - PU Sample → View button opens PDF modal
  - Immunity Sample → View button opens PDF modal  
  - Al-Benaa → View button opens PDF modal
  - Medical Lecture Deck → View button opens Canva link in new tab
  - Neonatal Jaundice (was Clinical Pathways) → View button opens Canva link in new tab
  - Text Bank, Study Summary, Behavior Exam → gallery with existing thumbnails
