"use client"

import clsx from "clsx"
import { NutIcon, TreePineIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Suspense, useCallback } from "react"
import VISION_HERO from "@/../public/vision-hero.webp"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCountUp } from "@/hooks/use-count-up"
import { APP_DESCRIPTION, APP_LOGO_SVG } from "@/lib/constants"

type HeroClientProps = {
  yearInIndustry: number
  farmingProjects: number
  userSatisfaction: number
  totalUsers: number
  topInvestors: { name: string | null; image: string | null; blurDataURL: string | null }[]
  mainHeadline: string
  subHeadline: string
  isAuthenticated: boolean
}

export function HeroClient({
  yearInIndustry,
  farmingProjects,
  userSatisfaction,
  totalUsers,
  topInvestors,
  mainHeadline,
  subHeadline,
  isAuthenticated,
}: HeroClientProps) {
  const totalUsersCount = useCountUp(totalUsers)
  const yearInIndustryCount = useCountUp(yearInIndustry)
  const farmingProjectsCount = useCountUp(farmingProjects)
  const userSatisfactionCount = useCountUp(userSatisfaction)

  const randomAvatarBgColors = [
    "bg-amber-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-teal-100",
    "bg-cyan-100",
    "bg-lime-100",
  ] as const

  const getBackgroundColor = useCallback(
    (name: string): string => {
      // Create a deterministic hash from the name
      const hash = name.split("").reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)

      // Use the hash to select a color
      const index = Math.abs(hash) % randomAvatarBgColors.length
      return randomAvatarBgColors[index] ?? randomAvatarBgColors[0]
    },
    [randomAvatarBgColors],
  )

  return (
    <section className="bg-background relative overflow-hidden py-12 select-none md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/70" />
        <Suspense fallback={<div className="absolute inset-0 bg-black/70" />}>
          <div className="relative h-full w-full">
            <video
              src="/hero.mp4"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-100`}
              autoPlay={true}
              loop={true}
              muted={true}
              playsInline
              preload="metadata"
              poster="/hero.webp"
            >
              <track label="thumbnails" default kind="metadata" />
              <track kind="metadata" label="cuepoints" />
              <track kind="chapters" label="chapters" />
              <track kind="captions" label="captions" />
            </video>
            <p className="sr-only">Hero video for {APP_DESCRIPTION}</p>
          </div>
        </Suspense>
      </div>

      <div className="relative z-20 container mx-auto md:max-w-[70rem]">
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-6 md:w-1/2">
            <div className="bg-secondary relative mx-auto h-[16rem] w-[16rem] rounded-full shadow-2xl transition-transform duration-300 hover:-translate-y-2 md:mx-0 md:mt-0 md:h-[21.25rem] md:w-[21.25rem] lg:h-[25rem] lg:w-[25rem]">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Image
                  src={VISION_HERO}
                  alt="Hero image showing agricultural investment opportunities"
                  className="h-full w-full object-cover object-bottom-right"
                  width={400}
                  height={400}
                  quality={70}
                  loading="eager"
                  priority
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 340px, 400px"
                  placeholder="blur"
                  blurDataURL={VISION_HERO.blurDataURL}
                />
              </div>
              <div className="absolute bottom-0 z-10 flex max-w-fit flex-col items-center justify-center rounded-full bg-white px-6 py-1 shadow-md">
                <div className="text-xs pt-1 text-gray-800 whitespace-nowrap">
                  إنضم لـ
                  <strong className="mx-1">+{totalUsersCount}</strong>
                  مستثمرين المستقبل
                </div>
                <div className="flex -space-x-2" dir="ltr">
                  {topInvestors.map(({ name, image }, index) => (
                    <Avatar
                      key={index}
                      className="bg-primary h-8 w-8 rounded-full border-2 border-white shadow-xs"
                    >
                      {
                        <Image
                          src={image || APP_LOGO_SVG} // we are using || if you want to fallback on any falsy value (e.g. empty string, null, undefined, false, 0).
                          alt={`المستثمر ${name ?? "مستثمر"}`}
                          width={32}
                          height={32}
                          className={clsx("h-full w-full object-contain", {
                            [getBackgroundColor(name ?? "مستثمر")]: !image,
                            "bg-background": image !== null,
                          })}
                          title={`المستثمر ${name ?? "مستثمر"}`}
                          quality={20}
                          loading="lazy"
                        />
                      }
                    </Avatar>
                  ))}
                </div>
              </div>
              <div className="bg-primary absolute top-0 right-0 flex h-[6.25rem] w-[6.25rem] rotate-12 rounded-3xl border-8 border-white lg:h-[6.875rem] lg:w-[6.875rem]">
                <TreePineIcon className="m-auto h-[2.5rem] w-[2.5rem] stroke-white lg:h-[3.125rem] lg:w-[3.125rem]" />
              </div>
              <div className="bg-primary absolute top-1/3 -left-10 flex h-[6.25rem] w-[6.25rem] -rotate-12 rounded-3xl border-8 border-white lg:h-[6.875rem] lg:w-[6.875rem]">
                <NutIcon className="m-auto h-[3.5rem] w-[3.5rem] -rotate-90 fill-white lg:h-[4.5rem] lg:w-[4.5rem]" />
              </div>
            </div>
            <div className="flex md:hidden">
              <StartInvestingCTAClient isAuthenticated={isAuthenticated} />
            </div>
          </div>

          <div className="flex flex-col items-center px-4 text-center md:hidden">
            <h1 className="mb-4 text-3xl leading-snug! font-extrabold text-white">
              {mainHeadline}
            </h1>
            <p className="mb-6 text-lg text-gray-200">{subHeadline}</p>
          </div>

          <div className="hidden flex-col justify-center gap-6 md:flex md:w-1/2">
            <h1 className="text-3xl leading-snug! font-extrabold text-white lg:text-5xl">
              {mainHeadline}
            </h1>
            <p className="text-lg text-gray-200 lg:max-w-[80%]">{subHeadline}</p>
            <StartInvestingCTAClient isAuthenticated={isAuthenticated} />
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <strong className="text-primary text-2xl font-medium lg:text-4xl">
                +{yearInIndustryCount}
              </strong>
              <div className="text-gray-200 lg:text-lg">سنوات الخبرة في المجال</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 border-b-[1px] border-white/10 p-6 text-center md:border-b-0 md:border-l-[1px]">
              <strong className="text-primary text-2xl font-medium lg:text-4xl">
                +{farmingProjectsCount}
              </strong>
              <div className="text-gray-200 lg:text-lg">مشاريع زراعية</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6 text-center">
              <strong className="text-primary text-2xl font-medium lg:text-4xl">
                %{userSatisfactionCount}
              </strong>
              <div className="text-gray-200 lg:text-lg">رضاء المستخدمين</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StartInvestingCTAClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="relative z-10 flex flex-wrap items-center gap-6">
      <Button asChild variant="default">
        <Link href={isAuthenticated ? "/dashboard" : "/signup"}>ابدأ الاستثمار</Link>
      </Button>
      <Button
        variant="ghost"
        className="not-dark:bg-accent hover:bg-accent-foreground hover:text-accent dark:bg-accent dark:hover:bg-accent-foreground dark:hover:text-accent"
        asChild
      >
        <Link href="/projects">عرض المشاريع</Link>
      </Button>
    </div>
  )
}
