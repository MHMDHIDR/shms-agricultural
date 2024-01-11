export const { origin }: any = typeof window !== 'undefined' && window.location

export const ITEMS_PER_PAGE = 5

const url = {
  local: `localhost`,
  dev: `dev.com`
}

export const APP_URL =
  process.env.NODE_ENV === 'development'
    ? `http://${origin?.includes(url.dev) ? url.dev : url.local}:3000`
    : process.env.NEXT_PUBLIC_APP_PUBLIC_URL

export const API_URL = APP_URL + '/api'
