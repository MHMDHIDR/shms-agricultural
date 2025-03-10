import { api } from "@/trpc/server"
import WithdrawalsClient from "./withdrawals-client"

export default async function WithdrawalsPage() {
  const withdrawOperations = await api.operations.getUserWithdrawOperations()

  return <WithdrawalsClient operations={withdrawOperations} />
}
