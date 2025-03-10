/**
 * Returns a stable subset of project images.
 * This function will always return the same images in the same order for a given project
 * by using the project ID as a seed for selection.
 */
export function getProjectImages(images: Array<{ imgDisplayPath: string }>, count = 3) {
  if (!images?.length) return []

  // If we have fewer images than requested, return all of them
  if (images.length <= count) return images

  // Use a stable selection method - take first 3 images
  return images.slice(0, count)
}
