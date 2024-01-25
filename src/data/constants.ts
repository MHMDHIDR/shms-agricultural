export const APP_TITLE = 'شمس | للخدمات الزراعية'

export const APP_DESCRIPTION =
  'شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'

export const ITEMS_PER_PAGE = 5

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
