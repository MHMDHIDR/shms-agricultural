export type UserProps = {
  shms_id: string
  shms_fullname: string
  shms_email: string
  shms_password?: string
  shms_phone?: string
  shms_doc?: string
  shms_created_at?: string
  userAccountType?: string
  userAccountStatus?: 'active' | 'block'
  userResetPasswordToken?: string
  userResetPasswordExpires?: string
  // When user is logged in, this is set to 1
  loggedIn?: number
  // When user is registered, this is set to 1
  userAdded?: number
}
