export const APP_TITLE = 'شمس | للخدمات الزراعية'

export const APP_DESCRIPTION =
  'شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'

export const APP_LOGO = 'https://shmsagricultural.com/logo-slogan.png'

export const APP_LOGO_sm = 'https://shmsagricultural.com/logo.svg'

export const SHMS_EMAIL = `mo.b2shir@gmail.com`

export const SHMS_PHONE = `+974 6602 7723`

export const ITEMS_PER_PAGE = 5

export const FILE_UPLOAD_IMG_SIZE = 122

//  max file upload size in MB = 5 MB
export const MAX_FILE_UPLOAD_SIZE = 5

export const WINDOW_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 0
export const MOBILE_SCREEN = 768

export const NAV_HEIGHT =
  typeof window === 'undefined' ||
  (document.querySelector('header') as HTMLElement) === null
    ? 150
    : (document.querySelector('header') as HTMLElement).offsetHeight + 50

/**
 * @description الوفت الافتراضي لإخفاء رسالة التنبيه بعد ظهورها = 5 ثواني
 */
export const DEFAULT_DURATION = 5000

export const APP_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3000`
    : process.env.NEXT_PUBLIC_APP_PUBLIC_URL

export const API_URL = APP_URL + '/api'

export const ADMIN_EMAIL = 'info@shmsagriculture.com'
