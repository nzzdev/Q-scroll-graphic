function getImageUrl(image, width, imageServiceUrl) {
  if (imageServiceUrl)
    return `${imageServiceUrl
      .replace("{key}", image.key)
      .replace("{width}", width)
      .replace("{format}", "pjpg")}&auto=webp`;
  else
    return image.url
}

export function getImageUrls(image, width, imageServiceUrl) {
  return {
    image1x: getImageUrl(image, width, imageServiceUrl),
    image2x: getImageUrl(image, width * 2, imageServiceUrl),
    image3x: getImageUrl(image, width * 3, imageServiceUrl),
    image4x: getImageUrl(image, width * 4, imageServiceUrl),
  };
}
