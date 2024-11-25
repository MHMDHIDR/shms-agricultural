import { MyTooltip } from "@/components/ui/tooltip";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { getAuthType, selectedPaymentOptions } from "@/types";

type PaymentMetodsProps = {
  selectedOption: string;
  setSelectedOption: Dispatch<SetStateAction<selectedPaymentOptions>>;
  totalPaymentAmount: number;
};

export default function PaymentMetods({
  selectedOption,
  setSelectedOption,
  totalPaymentAmount,
}: PaymentMetodsProps) {
  const localUser = localStorage.getItem("shms_user_data");
  // only destructure the totalCredits from the localUser if it's not null
  const { totalCredits }: getAuthType = localUser
    ? typeof window !== "undefined" && JSON.parse(String(localUser))
    : {};

  const handleOptionChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value);
  };

  const [balanceTotalCredits, setBalanceTotalCredits] = useState<
    getAuthType["totalCredits"] | null
  >(null);

  useEffect(() => {
    setBalanceTotalCredits(totalCredits);
  }, [totalCredits]);

  return (
    <div className="flex flex-col rtl gap-y-2">
      {/* فيزا   -- Visa */}
      <MyTooltip text="غير متاح حاليا" className="translate-x-14">
        <label className="opacity-50 cursor-not-allowed">
          <input
            type="radio"
            value="visa"
            checked={selectedOption === "visa"}
            onChange={handleOptionChange}
            disabled
          />
          <span className="mr-4">
            <strong>فيزا</strong>
            <small className="mr-2">(غير متاح حاليا)</small>
          </span>
        </label>
      </MyTooltip>
      {/* بطاقة ائتمانية   -- Credit Card */}
      <MyTooltip text="غير متاح حاليا" className="translate-x-14">
        <label className="opacity-50 cursor-not-allowed">
          <input
            type="radio"
            value="credit"
            checked={selectedOption === "credit"}
            onChange={handleOptionChange}
            disabled
          />
          <span className="mr-4">
            <strong>بطاقة ائتمانية</strong>
            <small className="mr-2">(غير متاح حاليا)</small>
          </span>
        </label>
      </MyTooltip>
      {/* نقدا   -- Cash */}
      <label className="cursor-pointer">
        <input
          type="radio"
          value="cash"
          checked={selectedOption === "cash"}
          onChange={handleOptionChange}
        />
        <span className="mr-4">
          <strong>نقدا</strong>
        </span>
      </label>
      {/* رصيدي في شمس   -- Balance */}
      <label className="cursor-pointer">
        <input
          type="radio"
          value="balance"
          checked={selectedOption === "balance"}
          onChange={handleOptionChange}
          disabled={(balanceTotalCredits ?? 0) < totalPaymentAmount}
        />
        <span className="mr-4">
          <strong>الخصم من رصيد شمس</strong>
          {(balanceTotalCredits ?? 0) < totalPaymentAmount && (
            <small className="mr-2">(رصيدك غير كافي لشراء الأسهم)</small>
          )}
        </span>
      </label>
    </div>
  );
}
