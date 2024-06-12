'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import type { UserLoggedInProps, getAuthProps, getAuthType } from '@/types'

/**
 * Custom method to check if user is authenticated
 * @returns {Promise<{ isAuth: boolean, userId: string, userType: string, userName: string, userEmail: string, userPhone: string, userStockLimit: number, withdrawableAmount: number, totalAmount: number, loading: boolean }>} User authentication data
 * @throws {Error} Error getting user session
 */
export const getAuth: getAuthProps = async (): Promise<getAuthType> => {
  let authData: getAuthType = {
    isAuth: false,
    userId: '',
    userType: 'user',
    userName: '',
    userEmail: '',
    userPhone: '',
    userStockLimit: 0,
    withdrawableAmount: 0,
    totalAmount: 0,
    loading: true
  }

  try {
    const user: UserLoggedInProps = await getServerSession(authOptions)

    if (user) {
      authData.userId = user?.token?.user.shms_id ?? ''
      authData.isAuth = user?.token?.user.loggedIn ? true : false
      authData.userType = user?.token?.user.shms_user_account_type ?? 'user' // default to user
      authData.userName = user?.token?.user.fullname ?? ''
      authData.userEmail = user?.token?.user.shms_email ?? ''
      authData.userPhone = user?.token?.user.shms_phone ?? ''
      authData.userStockLimit = user?.token?.user.shms_user_stock_limit ?? 0
      authData.totalAmount = user?.token?.user.shms_user_total_balance ?? 0
      authData.withdrawableAmount = user?.token?.user.shms_user_withdrawable_balance ?? 0
    }
    authData.loading = false
  } catch (error) {
    console.error(error)
    throw new Error('Error getting user session')
  }

  return { ...authData }
}
