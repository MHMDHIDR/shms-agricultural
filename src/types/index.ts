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
}
