import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

type SliderProps = React.ComponentProps<typeof Slider>

export function PercentageSlider({
  className,
  value,
  ...props
}: SliderProps & { value?: number[] }) {
  return (
    <div className='flex flex-col w-full justify-center items-center my-6'>
      <Slider
        defaultValue={value ?? [50]}
        max={100}
        step={1}
        className={cn('w-[60%]', className)}
        disabled
        {...props}
      />
      <span className='text-2xl select-none text-green-600 font-bold'>{value}%</span>
    </div>
  )
}
