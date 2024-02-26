import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

export default function MyDrawer({
  title,
  content,
  children,
  asSpan
}: {
  title?: React.ReactNode | string
  content: React.ReactNode
  children: React.ReactNode
  asSpan?: boolean
}) {
  return (
    <Drawer modal={true}>
      <DrawerTrigger>
        {asSpan ? (
          <span className='cursor-pointer'>{children}</span>
        ) : (
          <Button type='button' variant={'ghost'} className='mr-10'>
            {children}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          {title && (
            <DrawerTitle className='text-right rtl'>
              <h4>{title}</h4>
            </DrawerTitle>
          )}
          <DrawerDescription className='container mt-4 overflow-y-auto text-right rtl leading-10 max-h-56'>
            {content}
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
