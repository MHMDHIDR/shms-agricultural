import NextAuth, { type AuthOptions, Session, User, Account, Profile } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_URL } from '@/constants'
import type { JWT } from 'next-auth/jwt'
import { UserProps } from '@/types'

const { NEXTAUTH_SECRET } = process.env

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userEmailOrTel: { label: 'Email or Phone Number', type: 'text' },
        userPassword: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, _req) {
        try {
          const loginUser = await axios.post(`${API_URL}/users/login`, credentials)
          const { data: user } = loginUser
          if (user && user.LoggedIn === 1) {
            return Promise.resolve(user)
          }

          return Promise.resolve(null)
        } catch (error) {
          console.error('Error during authorization:', error)
          return Promise.resolve(null)
        }
      }
    })
  ],
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async session(params: { session: Session; token: JWT; user: User }) {
      const { session, token } = params
      return Promise.resolve({ session, token, expires: session.expires })
    },
    async jwt(params: {
      token: JWT & UserProps
      user: User
      account: Account | null
      profile?: Profile
    }) {
      const { token, user, profile } = params

      if (profile) {
        const { data: userExists }: { data: UserProps } = await axios.post(
          `${API_URL}/users/emailExists`,
          { userEmail: profile?.email ?? '' }
        )

        if (userExists) {
          token.user = userExists

          return token
        } else {
          token.user = user
          return token
        }
      } else if (user) {
        token.user = user
      }
      return Promise.resolve(token)
      // return token
    }
  }
} as AuthOptions)

export { handler as GET, handler as POST }
