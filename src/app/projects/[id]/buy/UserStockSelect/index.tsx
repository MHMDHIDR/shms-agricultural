import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function UserStockSelect({
  userStockLimit,
  setSelectedStocks,
  selectedStocks
}: {
  userStockLimit: number
  setSelectedStocks: (value: number) => void
  selectedStocks: number
}) {
  return (
    <Select
      dir='rtl'
      onValueChange={value => setSelectedStocks(Number(value))}
      value={String(selectedStocks)}
    >
      <SelectTrigger className='w-full border-gray-900'>
        <SelectValue placeholder='اختار عدد الأسهم' />
      </SelectTrigger>
      <SelectContent avoidCollisions={false}>
        {/*
          الحصول على  عدد الأسهم من السيشن وحسابها من الحد الأقصى
           لمخزون المستخدم إلى 1
        */}
        {Array.from({ length: userStockLimit }, (_, userStockLimitCounter) => (
          <SelectItem
            className='font-bold'
            key={userStockLimitCounter + 1}
            value={String(userStockLimitCounter + 1)}
          >
            {userStockLimitCounter + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
