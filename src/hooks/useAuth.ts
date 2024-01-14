import { useState, useEffect } from 'react'
import { getSession, useSession } from 'next-auth/react'
import { UserProps } from '@/types'

/**
 * Custom hook to check if user is logged in then redirect to dashboard or home page
 */

const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [userType, setUserType] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [userStatus, setUserStatus] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const { data: session }: { data: any /*LoggedInUserProps*/ } = useSession()

  useEffect(() => {
    const getUserSession = async () => {
      const session: any = await getSession()
      const { user }: { user: UserProps } = session?.token || { user: null }

      if (!user) {
        setIsAuth(false)
        setUserType('')
        setLoading(false)
      }

      if (
        ['admin', 'cashier', 'user'].includes(user?.userAccountType!) ||
        session?.token!?.user?.name ||
        // google login session
        session?.token!?.name
      ) {
        setIsAuth(true)
        setUserType(user.userAccountType!)
        setUserStatus(user.userAccountStatus!)
        setUserId(user.shms_id!)
        setLoading(false)
      }
    }

    getUserSession()

    return (): void => {
      setIsAuth(false)
      setUserType('')
      setUserStatus('')
      setUserId('')
    }
  }, [])

  return {
    user: {
      ...session?.token!.user,
      image: session?.token!.picture ?? null
    },
    isAuth,
    userType,
    userStatus,
    userId,
    loading
  }
}

export default useAuth
