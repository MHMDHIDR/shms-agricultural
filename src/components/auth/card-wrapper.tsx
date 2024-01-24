'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/auth/header'
import { BackButton } from '@/components/auth/back-button'
import { cn } from '@/lib/utils'

interface CardWrapperProps {
  children: React.ReactNode
  heading?: string | React.ReactNode
  headerLabel?: string
  backButtonLabel: string
  backButtonHref: string
  backButtonTarget?: string
  className?: string
}

export const CardWrapper = ({
  children,
  heading,
  headerLabel = '',
  backButtonLabel,
  backButtonHref,
  backButtonTarget,
  className
}: CardWrapperProps) => {
  return (
    <Card className={cn(`w-screen max-w-[1024px] md:w-[600px] shadow-md`, className)}>
      <CardHeader>
        <Header heading={heading} label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
          target={backButtonTarget ?? '_self'}
        />
      </CardFooter>
    </Card>
  )
}
