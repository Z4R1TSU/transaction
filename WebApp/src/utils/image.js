export function isLikelyUrl(src) {
  if (!src) return false;
  return /^(https?:)?\/\//.test(src) || /^blob:/.test(src);
}

export function normalizeImageSrc(src) {
  if (!src) return '';
  if (src.startsWith('data:image')) return src;
  if (isLikelyUrl(src)) return src;
  return `data:image/jpeg;base64,${src}`;
}


