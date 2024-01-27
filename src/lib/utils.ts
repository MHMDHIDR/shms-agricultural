import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * a function to merge tailwind classes
 * @param inputs the tailwind classes to be merged
 * @returns the merged tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * a function to validate if a string is a valid uuid
 * @param uuid the uuid string to be validated
 */
export function validateUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  )
}

/**
 * a function to validate if password meets the required strength
 * @param password the password string to be validated
 */

export const validatePasswordStrength = (password: string) => {
  // Define password strength criteria using regular expressions
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  // Check if the password meets all criteria
  const isValid =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialChar

  return isValid
}

/**
 * a function to validate if a string is a Phone number
 * @param phoneNumber
 * @returns boolean
 */
export const validateQatarPhoneNumber = (phoneNumber: string) => {
  const qatarPhoneNumberRegex = /^[34567]\d{7}$/
  return qatarPhoneNumberRegex.test(phoneNumber)
}

/**
 * a function to validate if a string is a valid email
 * @param phoneNumber
 * @returns boolean
 */
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

/**
 *  Method That Formats Date to Locale Date String
 * @param date  - date string to be formatted (e.g. 2021-08-01T12:00:00.000Z)
 * @returns   - formatted date string (e.g. Sunday, 1 August 2021, 13:00:00)
 */
export const arabicDate = (date: string) =>
  new Date(date).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })

/**
 * Method to scroll to a top the top of the page
 * @param scrollY - the scrollY position to scroll to
 * @returns void
 */
export const scrollToView = (scrollY: number | undefined = 500) =>
  setTimeout(
    () =>
      window.scrollTo({
        top: scrollY ?? (document.querySelector(`#hero`) as HTMLElement)?.offsetHeight,
        behavior: 'smooth'
      }),
    100
  )
