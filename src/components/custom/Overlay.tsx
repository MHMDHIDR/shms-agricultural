import { cn } from '@/lib/utils'

export default function Overlay({
  opacity = 'opacity-30',
  className
}: {
  opacity?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        `w-full h-full absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-green-900 to-green-500 ${opacity}`,
        className
      )}
    />
  )
}
