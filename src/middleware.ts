import { NextResponse } from 'next/server'

export { default } from 'next-auth/middleware'

const allowedOrigins = [
  'https://www.shmsagricultural.com',
  'https://shmsagricultural.com',
  'http://localhost:3000'
]

export function middleware(request: Request) {
  const origin = request.headers.get('Origin')
  if ((origin && !allowedOrigins.includes(origin)) || !origin) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile', '/projects/:path*/personalData']
}
