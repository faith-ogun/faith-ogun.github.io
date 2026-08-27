// Shared site-wide constants.

// The CV deliberately keeps the same filename, so every link Faith has already
// shared or printed stays valid when the PDF is replaced. The trade-off is that
// a repeat visitor's browser would otherwise serve its cached copy of the old
// version, so this stamp is what forces a refetch.
//
// WHEN YOU REPLACE public/assets/Faith_Ogundimu_CV.pdf: bump the date below to
// the day you swapped it in. Nothing else needs changing.
export const CV_UPDATED = '2026-08-27';
export const cvUrl = `/assets/Faith_Ogundimu_CV.pdf?v=${CV_UPDATED}`;
