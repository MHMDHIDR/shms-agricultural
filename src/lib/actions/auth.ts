'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import type { UserProps, UserLoggedInProps } from '@/types'

/**
 * Custom method to check if user is authenticated
 * @returns {Promise<{ isAuth, userType: UserProps['shms_user_account_type'], loading: boolean }>}
 */
export const getAuth = async (): Promise<{
  userId: UserProps['shms_id']
  isAuth: UserProps['loggedIn'] | boolean
  userType: UserProps['shms_user_account_type']
  userName?: string
  loading: boolean
}> => {
  let isAuth = false
  let userId = ''
  let userType = ''
  let userName = ''
  let loading = true

  try {
    const user: UserLoggedInProps = await getServerSession(authOptions)

    if (user) {
      userId = user?.token?.user.shms_id ?? ''
      isAuth = user?.token?.user.loggedIn ? true : false
      userType = user?.token?.user.shms_user_account_type ?? 'user' // default to user
      userName = user?.token?.user.shms_fullname ?? ''
    }
    loading = false
  } catch (error) {
    console.error(error)
    throw new Error('Error getting user session')
  }

  return {
    userId,
    isAuth,
    userType: userType as UserProps['shms_user_account_type'],
    userName,
    loading
  }
}
