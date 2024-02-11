import { NextResponse } from 'next/server'

export { default } from 'next-auth/middleware'

const allowedOrigins = [
  'https://www.shmsagricultural.com',
  'https://shmsagricultural.com',
  'http://localhost:3000'
]

export function middleware(request: Request) {
  // retrieve the current response
  const response = NextResponse.next()
  const origin = request.headers.get('origin')

  // Set the CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.append('Access-Control-Allow-Origin', origin)
  }

  response.headers.append('Access-Control-Allow-Credentials', 'true')
  response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile',
    '/projects/:path*/personalData',
    '/api/:path*'
  ]
}
