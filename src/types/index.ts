import { Session } from 'next-auth'

export type UserProps = {
  shms_id?: string
  shms_fullname?: string
  shms_email?: string
  shms_password?: string
  shms_phone?: string
  shms_created_at?: string
  token?: string
  image?: string
  LoggedIn?: number
  userAdded?: number
  message?: string
  userAccountType?: string
  userAccountStatus?: 'active' | 'block'
  userResetPasswordToken?: string
  userResetPasswordExpires?: string
} & Session['user']

export type NextUserProviderProps = {
  userFullName?: string
  shms_email?: string
  userAccountStatus?: string
  userAccountType?: string
  signupMethod?: string
  picture?: string
}

export type LoggedInUserProps =
  | (Session & {
      token?: {
        user: UserProps
        email: NextUserProviderProps['shms_email']
        picture: NextUserProviderProps['picture']
      }
      session?: {
        user: UserProps
      }
    })
  | null

export type ModalProps = {
  msg?: string
  extraComponents?: React.ReactNode
  status?: React.ReactNode
  modalHidden?: string
  classes?: string
  redirectLink?: string
  redirectTime?: number
  btnName?: string
  btnLink?: string
  ctaConfirmBtns?: string[]
  ctaSpecialBtns?: string[]
}
