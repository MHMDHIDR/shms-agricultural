'use client'

import { createContext, useState } from 'react'
import type { FormStatusProps } from '@/types'

export const FormStatusContext = createContext({} as FormStatusProps)

export const FormStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  return (
    <FormStatusContext.Provider
      value={{
        formStatus,
        setFormStatus
      }}
    >
      {children}
    </FormStatusContext.Provider>
  )
}
