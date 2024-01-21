export const ITEMS_PER_PAGE = 5

export const DEFAULT_DURATION = 5000

export const APP_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3000`
    : process.env.NEXT_PUBLIC_APP_PUBLIC_URL

export const API_URL = APP_URL + '/api'

export const ADMIN_EMAIL = 'info@shmsagriculture.com'
