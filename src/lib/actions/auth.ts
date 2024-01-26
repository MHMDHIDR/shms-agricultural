'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import type { UserLoggedInProps } from '@/types'

/**
 * Custom method to check if user is authenticated
 * @returns {Promise<{ isAuth: boolean, userType: string, loading: boolean }>}
 */
export const getAuth = async (): Promise<{
  isAuth: boolean
  userType: string
  userName?: string
  loading: boolean
}> => {
  let isAuth = false
  let userType = ''
  let userName = ''
  let loading = true

  try {
    const user: UserLoggedInProps = await getServerSession(authOptions)

    if (user) {
      isAuth = user?.token?.user.loggedIn ? true : false
      userType = user?.token?.user.shms_user_account_type ?? 'user'
      userName = user?.token?.user.shms_fullname ?? ''
    }
    loading = false
  } catch (error) {
    console.error(error)
    throw new Error('Error getting user session')
  }

  return { isAuth, userType, userName, loading }
}
