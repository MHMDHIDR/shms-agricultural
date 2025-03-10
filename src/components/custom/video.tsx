"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import TUMBNAIL from "@/../public/hero.webp"

type VideoProps = {
  src: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  videoDescription?: string
}

export default function Video({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  videoDescription = "The above video shows a tractor plowing a field. If you can't see the video.",
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let timeoutId: NodeJS.Timeout | null = null

    const handleLoadedData = () => {
      setIsLoaded(true)
      if (timeoutId) clearTimeout(timeoutId)
    }

    const handleError = () => {
      console.error("Video failed to load")
      if (timeoutId) clearTimeout(timeoutId)
    }

    // Set a timeout to ensure we don't wait indefinitely for video loading
    timeoutId = setTimeout(() => {
      // Do nothing, just keep showing the thumbnail if video hasn't loaded
      console.log("Video loading timeout reached")
    }, 3000)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("error", handleError)
    video.preload = "auto"
    video.load()

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("error", handleError)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (
        <Image
          src={TUMBNAIL}
          alt="Video placeholder"
          className="absolute inset-0 h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={TUMBNAIL.blurDataURL}
          fill
          priority
        />
      )}
      <video
        ref={videoRef}
        src={src}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="auto"
      >
        <track label="thumbnails" default kind="metadata" />
        <track kind="metadata" label="cuepoints" />
        <track kind="chapters" label="chapters" />
        <track kind="captions" label="captions" />
      </video>
      <p className="sr-only">{videoDescription}</p>
    </div>
  )
}
