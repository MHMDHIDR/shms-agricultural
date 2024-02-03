import { usePathname } from 'next/navigation'

interface HeaderProps {
  heading?: string | React.ReactNode
  label: string
}

export const Header = ({ label, heading }: HeaderProps) => {
  const isSigninPage = usePathname().includes('signin')

  return (
    <div className='flex flex-col items-center justify-center w-full gap-y-4'>
      <h1 className={`text-2xl font-bold select-none`}>
        {heading ?? (isSigninPage ? 'تسجيل الدخول' : 'انشاء حساب')}
      </h1>
      <p className='text-sm text-muted-foreground'>{label}</p>
    </div>
  )
}
