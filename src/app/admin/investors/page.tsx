import { APP_TITLE } from "@/lib/constants"
import { api } from "@/trpc/server"
import InvestorsClientPage from "./investors.client"

export default async function InvestorsPage() {
  const { investors, count } = await api.user.getInvestors()

  return (
    <section className="container mx-auto px-3">
      <div className="my-10 text-center select-none">
        <h1 className="text-xl font-bold">المستثمرين</h1>
        <small className="text-center text-sm text-muted-foreground">
          {APP_TITLE} تحتوي على <strong className="text-primary font-extrabold">{count}</strong>{" "}
          مستثمر
        </small>
      </div>

      <InvestorsClientPage investors={investors} count={count} />
    </section>
  )
}
