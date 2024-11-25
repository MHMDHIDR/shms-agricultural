import { Button } from "@/components/ui/button";
import { formattedPrice } from "@/libs/utils";
import Link from "next/link";
import type { Users } from "@prisma/client";

export default function Balance({
  totalCredits,
  noWithdrawButton,
}: {
  totalCredits: Users["shms_user_credits"];
  noWithdrawButton?: boolean;
}) {
  return (
    <div className="select-none grid grid-cols-1">
      {/* Second Grid Item */}
      <div className="space-y-2 divide-y divide-gray-300">
        <h1 className="text-lg font-bold">رصــيد الحساب</h1>
        <h3 className="py-4 text-3xl font-bold">{formattedPrice(totalCredits)}</h3>
        {!noWithdrawButton && (
          <Link href={"/profile/investments/withdraw"} className="border-none">
            <Button variant={"pressable"}>سحب الرصيد</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
