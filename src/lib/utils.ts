import type { abstractWordsProps, validateFileProps } from '@/types'
import { clsx, type ClassValue } from 'clsx'
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
 * a function to validate if a string is a valid file extension and size
 * and validate the file size to be less than 2MB
 * @param File [file] file to be validated
 * @returns {boolean} [boolean] isAllowedExtension
 * @returns {boolean} [boolean] isAllowedSize
 */
export const validateFile: validateFileProps = (
  file: File
): { isAllowedExtension: boolean; isAllowedSize: boolean } => {
  let isAllowedExtension = false
  let isAllowedSize = false

  // Get the file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const fileSizes = file.size / 1024 / 1024 // in MB
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf']

  // Check if the extension is allowed and the file size is less than 2MB
  allowedExtensions.includes(fileExtension!) && (isAllowedExtension = true)
  fileSizes <= 2 && (isAllowedSize = true)

  return { isAllowedExtension, isAllowedSize }
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

/**
 * a function to abstract words, if and give me the amount of words i want
 * @param words the words to be abstracted
 * @param wordsLength the amount of words to be returned
 * @param ellipsis if the words should be followed by ellipsis
 * @returns the abstracted words
 */
export const abstractWords: abstractWordsProps = ({ words, wordsLength, ellipsis }) => {
  const wordsArray = words.split(' ')
  const abstractedWords =
    wordsArray.length > wordsLength
      ? wordsArray.slice(0, wordsLength).join(' ') + (ellipsis ? '...' : '')
      : words
  return abstractedWords
}

/** A function to create a slug
 * making the text from (this is text) => (this-is-text)
 * @param txt the text to be converted to slug
 * @returns the slug
 */
export const createSlug = (txt: string) =>
  txt
    ?.replace(/[^A-Za-z0-9أ-ي -]/g, '') // remove invalid chars
    ?.replace(/\s+/g, '-') // collapse whitespace and replace by -
    ?.replace(/-+/g, '-') // collapse dashes replace with one dash
    ?.toLowerCase() //

/**
 * A function to remove the slug
 * @param txt the slug to be converted to text
 * @returns the normal text example (this-is-text) => (this is text)
 */
export const removeSlug = (txt: string) => txt?.replace(/-/g, ' ')
