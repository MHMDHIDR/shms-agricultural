"use server"

import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"
import { env } from "@/env"
import type { SharpOptions } from "sharp"

/**
 * Get the blur placeholder of an image, used for lazy loading
 * @param imageSrc The source of the image
 * @returns The blur placeholder of the image
 */
export async function getBlurPlaceholder({
  imageSrc,
  width = 10,
  height = 10,
}: {
  imageSrc: string
  width?: number
  height?: number
}): Promise<string | null> {
  try {
    // Handle local images from public directory during build
    if (imageSrc.startsWith("/")) {
      const publicDir: string = path.join(process.cwd(), "public")
      const imagePath: string = path.join(publicDir, imageSrc)

      try {
        await fs.access(imagePath)
      } catch {
        console.warn(`Local image not found: ${imagePath}`)
        return null
      }

      const imageBuffer = await fs.readFile(imagePath)
      const sharpOptions: SharpOptions = { failOn: "none" }
      const { data, info } = await sharp(imageBuffer, sharpOptions)
        .resize(width, height, { fit: "inside" })
        .toBuffer({ resolveWithObject: true })

      return `data:image/${info.format};base64,${data.toString("base64")}`
    }

    // Handle remote images
    const imageUrl = await getFullUrl(imageSrc)
    const response = await fetch(imageUrl)
    if (response.status !== 200) return null

    const buffer = await response.arrayBuffer()
    const sharpOptions: SharpOptions = { failOn: "none" }
    const { data, info } = await sharp(Buffer.from(buffer), sharpOptions)
      .resize(width, height, { fit: "inside" })
      .toBuffer({ resolveWithObject: true })

    return `data:image/${info.format};base64,${data.toString("base64")}`
  } catch (error) {
    console.warn("Error generating blur placeholder:", error)
    return null
  }
}

export async function optimizeImage({ base64, quality }: { base64: string; quality: number }) {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  const optimizedBuffer = await sharp(buffer).rotate().webp({ quality }).toBuffer()

  return `data:image/webp;base64,${optimizedBuffer.toString("base64")}`
}

export async function getFullUrl(path: string) {
  if (path.startsWith("http")) return path

  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return new URL(cleanPath, env.NEXT_PUBLIC_APP_URL).toString()
}
