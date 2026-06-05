import type { FieldScanResponse } from "./types";

export const NO_TREES_MESSAGE =
  "We couldn't detect any trees in this image. For best results, upload a top-down drone or aerial photo with clearly visible tree crowns.";

export function isNoTreesDetected(data: FieldScanResponse): boolean {
  return data.low_confidence === true || data.total_tree_count === 0;
}

export function hasGeminiError(data: FieldScanResponse): boolean {
  const { gemini_error: geminiError } = data;
  if (geminiError == null || geminiError === false) return false;
  if (typeof geminiError === "string") return geminiError.length > 0;
  return true;
}
