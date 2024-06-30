import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'

export default function MyDrawer({
  title,
  content,
  children,
  asSpan,
  className,
  classNameSpan
}: {
  title?: React.ReactNode | string
  content: React.ReactNode
  children: React.ReactNode
  className?: string
  asSpan?: boolean
  classNameSpan?: string
} & (
  | { asSpan: true; classNameSpan: string }
  | { asSpan?: false; classNameSpan?: undefined }
)) {
  return (
    <Drawer>
      <DrawerTrigger>
        {asSpan ? (
          <span
            className={cn(
              `py-2 px-4 rounded-md mx-5 hover:text-accent-foreground`,
              classNameSpan
            )}
          >
            {children}
          </span>
        ) : (
          <Button type='button' variant={'ghost'} className='mr-10'>
            {children}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className={cn(className)}>
        <DrawerHeader>
          {<DrawerTitle className='text-right rtl'>{title ?? ''}</DrawerTitle>}
          <DrawerDescription
            className={'container mt-4 overflow-y-auto text-right rtl leading-10'}
          >
            {content}
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
