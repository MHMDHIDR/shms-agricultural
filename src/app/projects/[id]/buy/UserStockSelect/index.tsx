import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function UserStockSelect({
  userStockLimit,
  setSelectedStocks
}: {
  userStockLimit: number
  setSelectedStocks: (value: number) => void
}) {
  return (
    <Select dir='rtl' onValueChange={value => setSelectedStocks(Number(value))}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='اختار عدد الأسهم' />
      </SelectTrigger>
      <SelectContent>
        {/*
          الحصول على  عدد الأسهم من السيشن وحسابها من الحد الأقصى
           لمخزون المستخدم إلى 1
        */}
        {Array.from({ length: userStockLimit }, (_, userStockLimitCounter) => (
          <SelectItem
            key={userStockLimitCounter + 1}
            value={String(userStockLimitCounter + 1)}
            className='font-bold'
          >
            {userStockLimitCounter + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
