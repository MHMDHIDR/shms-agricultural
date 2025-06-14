import { unstable_cache } from "next/cache"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { createCaller } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { auth } from "@/server/auth"
import { HeroClient } from "./hero-client"

export default async function Hero() {
  const getUsersData = unstable_cache(
    async () => {
      const context = await createTRPCContext({ headers: new Headers() })
      const caller = createCaller(context)
      return caller.user.getAll()
    },
    ["users-data"],
    {
      revalidate: 3600,
      tags: ["users"],
    },
  )

  const usersData = await getUsersData()

  // Get auth session for CTA
  const session = await auth()

  const YEAR_IN_INDUSTRY = Math.abs(2020 - new Date().getFullYear())
  const FARMING_PROJECTS = 1
  const USER_SATISFACTION = 100
  const TOTAL_USERS = usersData?.count ?? 1
  const MAIN_HEADLINE = "استثمر في مجال الزراعة في السودان"
  const SUB_HEADLINE = `"ازرع ثروتك اليوم.. واحصد نجاحك غدًا! استثمر في مستقبل الزراعة في السودان." 🌱💰`

  const shuffledUsers = usersData?.users ? [...usersData.users].sort(() => 0.5 - Math.random()) : []
  const TOP_INVESTORS = shuffledUsers.slice(0, 7)
  const investorsPromises = TOP_INVESTORS.map(async user => {
    const blurDataURL = user.image ? await getBlurPlaceholder({ imageSrc: user.image }) : null

    return { name: user.name ?? "مستثمر", image: user.image, blurDataURL }
  })
  const topInvestors = await Promise.all(investorsPromises)

  return (
    <HeroClient
      yearInIndustry={YEAR_IN_INDUSTRY}
      farmingProjects={FARMING_PROJECTS}
      userSatisfaction={USER_SATISFACTION}
      totalUsers={TOTAL_USERS}
      topInvestors={topInvestors}
      mainHeadline={MAIN_HEADLINE}
      subHeadline={SUB_HEADLINE}
      isAuthenticated={!!session}
    />
  )
}
