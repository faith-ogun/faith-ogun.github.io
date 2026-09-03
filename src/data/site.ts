// Shared site-wide constants.

// The CV deliberately keeps the same filename, so every link Faith has already
// shared or printed stays valid when the PDF is replaced. The trade-off is that
// a repeat visitor's browser would otherwise serve its cached copy of the old
// version, so this stamp is what forces a refetch.
//
// WHEN YOU REPLACE public/assets/Faith_Ogundimu_CV.pdf: bump the date below to
// the day you swapped it in. Nothing else needs changing.
export const CV_UPDATED = '2026-09-03';
export const cvUrl = `/assets/Faith_Ogundimu_CV.pdf?v=${CV_UPDATED}`;

// Same story for the logo: it is the favicon, the nav brand mark and the default
// og:image, all pointing at one filename. Replacing the file in place would leave
// repeat visitors (and cached favicons) on the old artwork, so it gets a stamp too.
//
// WHEN YOU REPLACE public/assets/faith_logo.png: bump the date below.
export const LOGO_UPDATED = '2026-08-28';
export const logoUrl = `/assets/faith_logo.png?v=${LOGO_UPDATED}`;
