/** Browsers can't show TIFF in <img>; use a converted JPEG sibling. */
export function resolveImageSrc(src) {
  if (!src || typeof src !== 'string') {
    return src
  }
  return src.replace(/\.tiff?$/i, '.jpg')
}

export function isTiffSrc(src) {
  return typeof src === 'string' && /\.tiff?$/i.test(src)
}
