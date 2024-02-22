'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import type { UserProps, UserLoggedInProps, getAuthProps, getAuthType } from '@/types'

/**
 * Custom method to check if user is authenticated
 * @returns {Promise<{ userId: UserProps['shms_id'], isAuth: UserProps['loggedIn'] |  boolean, userType: UserProps['shms_user_account_type'], userName?: UserProps['shms_fullname'], userStockLimit?: UserProps['shms_user_stock_limit'], withdrawableAmount?: UserProps['shms_user_withdrawable_balance'], loading: boolean }>}
 * @throws {Error} Error getting user session
 */
export const getAuth: getAuthProps = async (): Promise<getAuthType> => {
  let isAuth = false
  let userId = ''
  let userType = ''
  let userName = ''
  let userStockLimit = 0
  let withdrawableAmount = 0
  let loading = true

  try {
    const user: UserLoggedInProps = await getServerSession(authOptions)

    if (user) {
      userId = user?.token?.user.shms_id ?? ''
      isAuth = user?.token?.user.loggedIn ? true : false
      userType = user?.token?.user.shms_user_account_type ?? 'user' // default to user
      userName = user?.token?.user.shms_fullname ?? ''
      userStockLimit = user?.token?.user.shms_user_stock_limit ?? 0
      withdrawableAmount = user?.token?.user.shms_user_withdrawable_balance ?? 0
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
    userStockLimit,
    withdrawableAmount,
    loading
  }
}
