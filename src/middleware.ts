export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/profile', '/projects/:path*/personalData']
}
