// app/hooks/useThumbnailUrl.ts
const fallbackThumbnailSrc = "https://via.placeholder.com/150?text=No+Image";

export const useThumbnailUrl = (thumbnail: string | null | undefined): string => {
  if (!thumbnail || thumbnail.trim() === "") return fallbackThumbnailSrc;

  try {
    const url = new URL(thumbnail); // validasi URL
    return url.href;
  } catch (error) {
    return fallbackThumbnailSrc;
  }
};
