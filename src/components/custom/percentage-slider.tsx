import { cn } from '@/libs/utils'
import { Slider } from '@/components/ui/slider'

type SliderProps = React.ComponentProps<typeof Slider>

export function PercentageSlider({
  className,
  value,
  ...props
}: SliderProps & { value?: number[] }) {
  return (
    <div className='flex flex-col items-center justify-center w-full my-6'>
      <Slider
        defaultValue={value ?? [50]}
        max={100}
        step={1}
        className={cn('w-[60%]', className)}
        disabled
        {...props}
      />
      <span className='mt-4 text-2xl font-bold text-green-600 select-none'>{value}%</span>
    </div>
  )
}
