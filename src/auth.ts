import { API_URL } from '@/data/constants'
import axios from 'axios'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions, Session, User } from 'next-auth'
import type { Users } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    // Docs: https://next-auth.js.org/configuration/providers/credentials
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        emailOrPhone: {
          label: 'البريد الالكتروني أو رقم الهاتف',
          type: 'text',
          placeholder: 'البريد الالكتروني أو رقم الهاتف'
        },
        password: { label: 'Password:', type: 'password', placeholder: 'كلمة المرور' }
      },
      async authorize(credentials) {
        try {
          const loginUser = await axios.post(`${API_URL}/users/signin`, credentials)
          const { data: user, status }: { data: Users; status: number } = loginUser

          // Handle success case
          if (status === 200 && user && user.loggedIn === 1) {
            return user // Login successful, return user object
          } else {
            // Handle specific errors
            if (status === 403 || status === 401) {
              const errorMessage = user?.message || 'Authentication failed'
              throw new Error(errorMessage)
            }
          }

          return null
        } catch (error: any) {
          console.error('Error during authorization:', error)
          // Pass the error message from the server
          throw new Error(error.response?.data?.message || 'Unknown error occurred')
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true
    },
    async session(params): Promise<Session> {
      const { session, token } = params
      return Promise.resolve({ session, token, expires: session.expires })
    },
    async jwt(params: { token: JWT; user: User }) {
      const { token, user } = params

      if (user) {
        token.user = user
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}
