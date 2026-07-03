<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/027f1f40-112e-406b-9399-885486d8c8d2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🛠️ Documentation of Changes & Bug Fixes

Here is a summary of all architectural changes, bug fixes, and feature additions applied to simplify, optimize, and polish the D'code IAS Academy portal.

### 🐛 Bug Fixes & Compilation Resolutions

1. **TypeScript Module Resolution Failures**:
   - **Problem**: The core typescript data files `data.ts`, `types.ts`, `db.ts`, and `email.ts` were incorrectly placed under the root `assets/services` folder, causing Rollup and tsc compilation failures in `src/App.tsx`.
   - **Fix**: Re-organized them into their correct directories under the source directory:
     - `assets/services/data.ts` ➔ [data.ts](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/data.ts)
     - `assets/services/types.ts` ➔ [types.ts](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/types.ts)
     - `assets/services/db.ts` ➔ [db.ts](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/services/db.ts) (within a new `src/services` folder)
     - `assets/services/email.ts` ➔ [email.ts](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/services/email.ts) (within a new `src/services` folder)

2. **Rollup Image Import & Path Crashes**:
   - **Problem**: Component files imported assets such as `1.jpeg` through `5.jpeg`, `Ceo.jpeg`, and `LOGO.jpeg` relatively from `src/`, but they existed under `assets/.aistudio/Pictures/`. The build script also crashed trying to resolve `toppersPoster` from a non-existent `../hero.png` file.
   - **Fix**: Copied the images to the `/src` folder to fix the relative imports, and removed the unused, invalid `toppersPoster` import.

3. **Topper Image Placeholder Replacements**:
   - **Problem**: The topper highlights gallery displayed generic stock photos and placeholder URLs.
   - **Fix**: Created the `src/assets/toppers/` directory, copied the authentic student images inside, and configured `Toppers.tsx` to reference them.

4. **Git Repository Cleanup & Exclusions**:
   - **Problem**: The repository index tracked unnecessary build outputs like `dist.zip` and root-level directories like `assets/` which contained stale service code duplicates.
   - **Fix**: Untracked `dist.zip` and configured [.gitignore](.gitignore) to ignore build targets, logs, caches, environment configs, and the root-level `assets/` directory.

5. **Live Faculty Image Loading Fix**:
   - **Problem**: Sudhagaran Sir's photo inside the `FACULTY` array in `data.ts` was referenced as a plain path string (`image: 'src/Ceo.jpeg'`), causing it to fail to load in the production build.
   - **Fix**: Imported `Ceo.jpeg` as a TypeScript module (`import ceoPhoto from './Ceo.jpeg'`) and referenced it as `image: ceoPhoto`, enabling Vite to process and bundle it correctly.

---

### ✨ Features & UX Optimizations

1. **Dedicated Toppers Grid & Lightbox Detail Modal**:
   - **Implementation**: Created a new [Toppers.tsx](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/components/Toppers.tsx) component encapsulating the UPSC direct mentorship selections grid. Built an interactive Lightbox Modal showcasing student names, ranks, strategies, and quotes. Restored its placement in [App.tsx](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/App.tsx).
   - **Update**: Removed the placeholder highlight for `Rajeshwari Suve M` completely.

2. **Interactive Hero background slideshow**:
   - **Implementation**: Replaced the static hero gallery with an automated, smooth cross-fading background slider in [Hero.tsx](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/components/Hero.tsx) using the campus pictures.
   - **Controls**: Configured outer-edge vertically centered pagination buttons (`ChevronLeft` and `ChevronRight` on the leftmost/rightmost edges) and a bottom-centered indicator (`1 / 7`).

3. **Premium Liquid Glassmorphic Card Container**:
   - **Implementation**: Wrapped the Hero text and buttons inside a glassmorphic container (`bg-black/35 backdrop-blur-md border border-white/10`) with internal crimson and deep navy organic glow spots (`filter blur-3xl`) to guarantee 100% legibility over any background slide image.

4. **Dynamic Batch Admissions Statuses**:
   - **Implementation**: Modified the admissions schedule component [BatchSchedule.tsx](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/components/BatchSchedule.tsx) to support `'Coming Soon'` and `'Closed'` states.
   - **Update**: Configured `Mains Momentum 2027` availability to `'Closed'` with rose-themed badge styles and a Lucide `XCircle` icon.

5. **Advanced SEO & Crawlability**:
   - **Meta Tags**: Optimized the main keywords, meta descriptions, and title tags in [index.html](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/index.html) to target Chennai and Tamil Nadu IAS/TNPSC coaching search queries.
   - **Canonical & Heading Hierarchy**: Set a Canonical Link and restructured the main header tag in `Hero.tsx` to `<h1>` for standard search crawler optimization.
   - **Link Sharing Thumbnail**: Updated social share graph previews (`og:image`, `twitter:image`) and Local Schema JSON-LD logo mappings to point directly to the school's official logo `/src/LOGO.jpeg`.

6. **Hero Card Close Button & Mobile Layout Spacing**:
   - **Interactive Close Button**: Added an exit close button (`X`) to the top-right corner of the liquid glassmorphism card, allowing users to hide the details block to view the sliding background slideshow cleanly. Added a subtle "Show Details" floating button on the top-right to restore the text.
   - **Overlapping Fix on Mobile**: Shrank the slide buttons on mobile screens (`w-8 h-8`) and pushed them closer to the edges (`left-2`/`right-2`), while increasing outer container horizontal padding (`px-10` on mobile) to guarantee a safe spacing gap that prevents buttons from overlapping the card's text.
   - **Close Button Alignment Tweaks**: Relocated the Hero card close button to `top-2 right-2` on mobile screens and added a top margin (`mt-4 sm:mt-0`) on the Admission Open badge to prevent any overlaps or layout clashes in compact mobile views.

7. **Toppers Grid Cleanups**:
   - **Profile Removal**: Removed the topper profile for `Mouleswaran S` from the UPSC toppers grid selections list in [Toppers.tsx](file:///c:/Users/bhuva/Downloads/ias-academy%20(1)/src/components/Toppers.tsx).

