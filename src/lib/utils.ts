import { API_URL, DEFAULT_DURATION, MAX_FILE_UPLOAD_SIZE } from '@/data/constants'
import type {
  ProjectProps,
  UserProps,
  abstractWordsProps,
  validateFileProps,
  withdrawActionsProps
} from '@/types'
import axios from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { Success, Error as ErrorIcon } from '@/components/icons/Status'
import React from 'react'

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
export const validatePhone = (phoneNumber: string) => phoneNumber.length >= 8

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
 * @param string [allowedExtensions] the types are the allowed file extensions optional parameter, if not provided all of the file extensions are allowed

 * @returns {boolean} [boolean] isAllowedExtension
 * @returns {boolean} [boolean] isAllowedSize
 */
export const validateFile: validateFileProps = (
  file: File,
  allowedExtensions?: string[]
): { isAllowedExtension: boolean; isAllowedSize: boolean } => {
  let isAllowedExtension = false
  let isAllowedSize = false

  // Get the file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const fileSizes = file.size // in bytes

  // Check if the extension is allowed and the file size is less than 2MB
  allowedExtensions?.includes(fileExtension!) && (isAllowedExtension = true)
  fileSizes <= MAX_FILE_UPLOAD_SIZE * 1024 * 1024 && (isAllowedSize = true)

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

export async function getProject(projectId: ProjectProps['shms_project_id']) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/get/${projectId}`
  )

  return project
}

/**
 * A function to get the user data (for a single user)
 * @param userId
 * @returns Promise<UserProps | undefined>
 */
export async function getUser(
  userId: UserProps['shms_id']
): Promise<UserProps | undefined> {
  const {
    data: user
  }: {
    data: UserProps[]
  } = await axios.get(`${API_URL}/users/all?userId=${userId}`)

  return user[0]
}

/**
 * A function to get the user money operations (for a single user)
 * Example of usage:
 * getting the user withdrawable balance
 * also getting the deposit balance
 * @param userId
 * @returns Promise<withdrawActionsProps | undefined>
 */
export async function getUserMoneyOperations(
  userId?: withdrawActionsProps['shms_user_id']
): Promise<withdrawActionsProps[]> {
  const {
    data: withdrawActions
  }: {
    data: withdrawActionsProps[]
  } = userId
    ? await axios.get(`${API_URL}/withdrawActions/get/${userId}`)
    : await axios.get(`${API_URL}/withdrawActions/get/all`)

  return withdrawActions
}

/**
 * A function to get the project date in arabic
 * @param {Date} date
 * @returns {string} arabic date
 */
export function getProjectDate(date: Date): string {
  return arabicDate(String(date)).split('في')[0]?.trim() ?? 'غير معروف'
}

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

/**
 * A function to get the project status in arabic
 * @param {string} status
 * @returns {string} arabic status
 */
export function getProjectStatus(status: string): string {
  return status === 'active'
    ? 'مفعل'
    : status === 'pending'
    ? 'قيد التفعيل'
    : status === 'withdraw'
    ? 'ســـحب رصيد'
    : status === 'deposit'
    ? 'إيـــــــداع رصيد'
    : status === 'completed'
    ? 'تم الموافقة'
    : status === 'deposit'
    ? 'قيد المراجعة'
    : status === 'rejected'
    ? 'تم الرفض'
    : status
}

/**
 * A function to get the project study case document
 * @param {string} studyCase
 * @returns {string} studyCase document path
 */
export function getProjectStudyCase(
  studyCase: ProjectProps['shms_project_study_case']
): string {
  let imgDisplayPath = null
  try {
    imgDisplayPath = JSON.parse(String(studyCase))
  } catch (error: any) {
    throw new Error('Error parsing study case data:', error.message)
  }

  return imgDisplayPath[0] ? imgDisplayPath[0].imgDisplayPath : null
}

/**
 * A function to get the project duration in Months
 */
export function getProjectDuration(projectStartDate: Date, projectEndDate: Date): string {
  const startDate = new Date(projectStartDate)
  const endDate = new Date(projectEndDate)

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))

  return diffMonths > 2 ? `${diffMonths} أشهر` : `${diffMonths} شهر`
}

/**
 *  A function to scrollToView of an element
 * @param scrollY the y position to scroll to
 * @returns void
 */
export const scrollToView = (scrollY: number | undefined = 500) =>
  setTimeout(
    () =>
      window.scrollTo({
        top: scrollY ?? (document.querySelector(`#hero`) as HTMLElement)?.offsetHeight, // ==> window.scrollY / 3
        behavior: 'smooth'
      }),
    100
  )

/**
 * A function to redirect
 * @param url the url to be redirected to
 * @returns void
 */
export const redirect = (url: string, time: number = DEFAULT_DURATION) =>
  window.location
    ? setTimeout(() => ((window as any).location = url), time)
    : setTimeout(() => ((window as any).location.replace = url), time)

/*
 * A function to copy a string to the clipboard
 * @param code the string to be copied to the clipboard
 * @returns void
 * */
export const handleCopyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)

    toast('تم النسخ', {
      icon: React.createElement(Success, { className: 'w-6 h-6 ml-3' }),
      position: 'bottom-center',
      className: 'text-right select-none rtl',
      duration: DEFAULT_DURATION / 3,
      style: {
        backgroundColor: '#F0FAF0',
        color: '#367E18',
        border: '1px solid #367E18',
        gap: '1.5rem',
        textAlign: 'justify'
      }
    })
  } catch (error) {
    toast(JSON.stringify(error), {
      icon: React.createElement(ErrorIcon, { className: 'w-6 h-6 ml-3' }),
      position: 'bottom-center',
      className: 'text-right select-none rtl',
      style: {
        backgroundColor: '#FFF0F0',
        color: '#BE2A2A',
        border: '1px solid #BE2A2A',
        gap: '1.5rem',
        textAlign: 'justify'
      }
    })
  }
}
