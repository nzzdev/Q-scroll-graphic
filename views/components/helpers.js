function getImageUrl(image, width, format, imageServiceUrl) {
  return `${imageServiceUrl
    .replace("{key}", image.key)
    .replace("{width}", width)
    .replace("{format}", format)}&auto=webp`;
}

export function getImageUrls(image, width, imageServiceUrl) {
  return {
    image1x: getImageUrl(image, width, "png", imageServiceUrl),
    image2x: getImageUrl(image, width * 2, "png", imageServiceUrl),
    image3x: getImageUrl(image, width * 3, "png", imageServiceUrl),
    image4x: getImageUrl(image, width * 4, "png", imageServiceUrl),
  };
}
