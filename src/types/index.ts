import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type UserProps = {
  shms_id: string
  shms_fullname: string
  fullname?: string
  shms_nationality: string
  shms_date_of_birth: Date
  shms_email: string
  shms_password?: string
  shms_phone?: string
  shms_doc?: string
  shms_created_at?: string
  shms_user_account_type?: 'admin' | 'user'
  shms_user_account_status?: 'active' | 'block' | 'pending'
  shms_user_reset_token?: string
  shms_user_reset_token_expires?: number
  // When user action happens
  message?: string
  // When user is logged in, this is set to 1
  loggedIn?: number
  // When user is registered, this is set to 1
  userAdded?: number
  // When user is activated, this is set to 1
  userActivated?: number
  // When user forgot password, this is set to 1
  forgotPassSent?: number
  // When user reset password, this is set to 1
  newPassSet?: number
  // When user changes their email, this is set to 1
  resetEmail?: number
}

export type UserLoggedInProps =
  | (Session & {
      token?: JWT & {
        user: UserProps
      }
    })
  | null

export type FileUploadProps = {
  file: File[]
  onFileAdd: (e: { target: { files: any } }) => void
}

export type fileRequestProps = NextApiRequest & {
  key: string
  type: string
}

export type DocImgsProps = {
  docImgDisplayPath: string
  docImgDisplayName: string
}

export type uploadurlDataProps = {
  data: {
    map(arg0: ({ fields, url }: any, idx: number) => Promise<void>): unknown
    fields: {
      'Content-Type': string
      'PolicyX-Amz-Algorithm': string
      'X-Amz-Credential': string
      'X-Amz-Date': string
      'X-Amz-Signature': string
      bucket: string
      key: string
    }
    url: string
  }[]
}

// User Email
export type customEmailProps = (props: {
  title?: string
  msg?: string
  buttonLink?: string
  buttonLabel?: string
  logoSrc?: string
}) => string

export type emailProps = {
  emailOrPhone: string
  address: string
  message: string
  mailSent?: number
}
