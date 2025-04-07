"use client"

import { NutIcon, TreePineIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import VISION_HERO from "@/../public/vision-hero.webp"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCountUp } from "@/hooks/use-count-up"
import { APP_DESCRIPTION } from "@/lib/constants"

// import { APP_LOGO_SVG } from "@/lib/constants"

const HeroVideo = () => (
  <div className="relative h-full w-full">
    <video
      src={
        "https://new-shms.s3.eu-west-2.amazonaws.com/hero.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA2ZH4GVJKVPPQSSV5%2F20250407%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250407T080315Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIQDLOf%2BTOOUrzlT%2FRKDyusjFK%2FeYnKyTCUu2CIDm6vBymgIgAlqSos3nlBjWTWg3XeoGDTaj3ibrMV0XabmHv0GfYXEq7AIIWRAAGgw3NDE0MTA3Nzc2ODUiDE%2BPXnoHWDmWFQnY7CrJAje8%2B9PMHq03i9%2Fdia2MHLiCqksN1p4YML3V3IsDlwdgV%2F0tdjoG5C%2FTHHV3zUucY3KGDIXwYbg%2BQ0bjWRjN6d6xfejhYM3m4Ee7mOxaKy7fiDCJXv9Yc%2FF77KrChbTyWTdiWcl6mWqiM%2Fivj2VLvyJ1EwpqVKzqKgUlcDKfUEr%2FXAUf5QwPDl%2FxeZzf1ST31CkDY1v6ODP%2F8B558yLgdU4T22NgHGn5QvjDRK28Ysc0Tj6DNPWEa3KnMDqWoXkISb0CrPruJKPUylyGfoSw%2Fbz4%2BtJBdiq1ZNaSJunPhlwnwO%2B670FUx0Bc8ePrxpWnIJnuuTWCalOn95%2Bg6NCB68%2BGTcqZhlHdPA9R6Mv1aUOnwIJTwRvJCLF5WtMJIaGATM%2FNL0cufwTxDVbEon3ifU1m5bOHe4pk%2FEvsZAyrhdzel9mWBCkWmGB2ML2Fzr8GOrMC0BbyfCaOkTaFaAHyP4gPKgwGW%2BmaE5pxXLHYqc1tb2i%2FMNRf5UazQkuMOMcXT3E6caKbIDftBUDdH77v%2BOd6V48pCoTqNFKiRCFtIPofXKUryMBjac3Pd5jb3XWeJ8%2Bi6CKkXAKvuDcBEcefO%2BgksCk77D%2BiwCgMJ1kY7clcO2ENe9QYIBfI%2BVXsiUxVBE%2F9i6aoYl8slzPGaJE93Ja%2FjSQdixqHz58Lb9f0nFLphv9pM3Yq7a%2B1GJJFH8gWeZN9D%2Bq5%2BmglQuCRyiaoV%2BWW4IPNAvPfPJPgaFbXdXIoUKVmkWDQKGAWHXNCbBUmZSj5TAo5z0lxMTYaUiryRqFqp1JdhFz6BsKcENA3Lsn9SrBDxn4UEX81AjiRrbMCz0WMXhv8JIwJ73twDdBvLJjag62f6w%3D%3D&X-Amz-Signature=c9776fd435964ba7b20d46c655053fd87bb77af4035edf2e650923dcb9627647&X-Amz-SignedHeaders=host&response-content-disposition=inline"
      }
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
)

type HeroClientProps = {
  yearInIndustry: number
  farmingProjects: number
  userSatisfaction: number
  totalUsers: number
  topInvestors: { name: string; image: string | null; blurDataURL: string | null }[]
  mainHeadline: string
  subHeadline: string
  isAuthenticated: boolean
}

export function HeroClient({
  yearInIndustry,
  farmingProjects,
  userSatisfaction,
  totalUsers,
  // topInvestors,
  mainHeadline,
  subHeadline,
  isAuthenticated,
}: HeroClientProps) {
  const totalUsersCount = useCountUp(totalUsers)
  const yearInIndustryCount = useCountUp(yearInIndustry)
  const farmingProjectsCount = useCountUp(farmingProjects)
  const userSatisfactionCount = useCountUp(userSatisfaction)

  return (
    <section className="bg-background relative overflow-hidden py-12 select-none md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/70" />
        <Suspense fallback={<div className="absolute inset-0 bg-black/70" />}>
          <HeroVideo />
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
                  className="h-full w-full object-cover"
                  width={400}
                  height={400}
                  quality={75}
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
                {/* <div className="flex -space-x-2" dir="ltr">
                  {topInvestors.map(({ name, image }, index) => (
                    <Avatar
                      key={index}
                      className="bg-primary h-8 w-8 rounded-full border-2 border-white shadow-xs"
                    >
                      {image ? (
                        <Image
                          src={image ?? APP_LOGO_SVG}
                          alt={`المستثمر ${name}`}
                          width={32}
                          height={32}
                          className="h-full w-full object-contain bg-amber-100"
                          title={`المستثمر ${name}`}
                          quality={20}
                          loading="lazy"
                        />
                      ) : (
                        <AvatarFallback
                          className="text-foreground text-xs dark:text-white"
                          title={`Investor ${name}`}
                        >
                          {name}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  ))}
                </div> */}
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
