function getImageUrl(image, width, format, imageServiceUrl) {
  return imageServiceUrl
    .replace("{key}", image.key)
    .replace("{width}", width)
    .replace("{format}", format);
}

export function getImageUrls(image, width, imageServiceUrl) {
  return {
    png1x: getImageUrl(image, width, "png", imageServiceUrl),
    png2x: getImageUrl(image, width * 2, "png", imageServiceUrl),
    png3x: getImageUrl(image, width * 3, "png", imageServiceUrl),
    png4x: getImageUrl(image, width * 4, "png", imageServiceUrl),
    webp1x: getImageUrl(image, width, "webply", imageServiceUrl),
    webp2x: getImageUrl(image, width * 2, "webply", imageServiceUrl),
    webp3x: getImageUrl(image, width * 3, "webply", imageServiceUrl),
    webp4x: getImageUrl(image, width * 4, "webply", imageServiceUrl),
  };
}

export function getPreloadImageUrl(image) {
  const dpr = window.devicePixelRatio;
  return image[`webp${dpr}x`];
}
