import { cn } from '@/libs/utils'
import { ShmsIcon } from '../icons/socials'
import { Skeleton } from '../ui/skeleton'

export const LoadingPage = () => (
  <div
    className='fixed inset-0 flex items-center justify-center w-screen h-screen bg-lime-200 dark:bg-lime-900 z-[100000]
    [--hue:223]
    [--bg:hsl(var(--hue),_10%,_90%)]
    [--fg:hsl(var(--hue),_10%,_10%)]
    [--primary:hsl(var(--hue),_90%,_55%)] dark:[--primary:hsl(var(--hue),_50%,_75%)]
    [--trans-dur:0.3s]
  '
  >
    <ShmsIcon className='w-20 h-20 animate-bounce' />
  </div>
)

export const LoadingCard = ({ className }: { className?: string }) => (
  <div className='space-y-2'>
    <Skeleton className={cn(`w-full h-12`, className)} />
    <Skeleton className={cn(`w-full h-12`, className)} />
    <Skeleton className={cn(`w-full h-12`, className)} />
    <Skeleton className={cn(`w-full h-12`, className)} />
  </div>
)
