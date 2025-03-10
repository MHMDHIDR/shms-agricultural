import FAQ from "@/components/custom/faqs"
import Hero from "@/components/custom/hero"
import OurServices from "@/components/custom/our-services"
import { StartNowCTA } from "@/components/custom/our-services/start-now-cta"
import OurValues from "@/components/custom/our-values"
import { HydrateClient } from "@/trpc/server"

export default function Home() {
  return (
    <HydrateClient>
      <Hero />
      <OurValues />
      <OurServices>
        <StartNowCTA />
      </OurServices>
      <FAQ pathname="/" />
    </HydrateClient>
  )
}
