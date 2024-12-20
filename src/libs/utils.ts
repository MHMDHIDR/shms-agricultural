import React from 'react'
import {
  API_URL,
  APP_URL,
  DEFAULT_DURATION,
  MAX_FILE_UPLOAD_SIZE
} from '@/data/constants'
import axios from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { Success, Error as ErrorIcon } from '@/components/icons/status'
import { VisibilityState } from '@tanstack/react-table'
import { signOut } from 'next-auth/react'
import type { abstractWordsProps, validateFileProps } from '@/types'
import type { Projects, Users, withdraw_actions } from '@prisma/client'

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
 * @returns boolean if the uuid is valid
 */
export function validateUUID(uuid: string): boolean {
  // validate if uuid is a value mongodb id
  const isValidMongoId = uuid.match(/^[0-9a-fA-F]{24}$/) !== null
  const isValidUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      uuid
    )

  return isValidMongoId || isValidUUID
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
  const fileExtension = file?.name.split('.').pop()?.toLowerCase()
  const fileSizes = file?.size // in bytes

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
export const arabicDate = (date: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }

  // if date is a string, convert it to a date object else use the date object
  const formattedDate = typeof date === 'string' ? new Date(date) : date
  return formattedDate.toLocaleDateString('ar-EG', options)
}

export async function getProject(projectId: string): Promise<Projects> {
  try {
    if (!projectId) throw new Error('projectId is undefined or null')

    const response = await axios.get(`${API_URL}/projects/get/${projectId}`)
    const project = response.data.project

    if (!project || !project.id) throw new Error('Project not found')

    return project
  } catch (error: any) {
    console.error('Error fetching project:', error)

    if (error.response && error.response.status === 404) {
      throw new Error('Project not found with the provided ID: ' + projectId)
    } else if (error.response && error.response.status >= 500) {
      throw new Error('Server error while fetching the project.')
    } else {
      throw new Error('Unknown error occurred while fetching the project.')
    }
  }
}

/**
 * A function to get the user data (for a single user)
 * @param userId
 * @returns Promise<Users | undefined>
 */
export async function getUser(userId: Users['id']): Promise<Users | undefined> {
  const {
    data: user
  }: {
    data: Users[]
  } = await axios.get(`${API_URL}/users/all?userId=${userId}`)

  return user[0]
}

/**
 * A function to get the user money operations (for a single user)
 * Example of usage:
 * getting the user withdrawable balance
 * also getting the deposit balance
 * @param userId
 * @returns Promise<withdraw_actions | undefined>
 */
export async function getUserMoneyOperations(
  userId?: withdraw_actions['id']
): Promise<withdraw_actions[]> {
  const response = userId
    ? await fetch(`${API_URL}/withdrawActions/get/${userId}`, {
        next: { revalidate: 0 }
        //,cache: 'no-store'
      })
    : await fetch(`${API_URL}/withdrawActions/get/all`, {
        next: { revalidate: 0 }
        //,cache: 'no-store'
      })

  const withdrawActions: withdraw_actions[] = await response.json()

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
    ? 'قيد المراجعة'
    : status === 'withdraw'
    ? 'ســـحب رصيد'
    : status === 'deposit'
    ? 'إيـــــــداع رصيد'
    : status === 'completed'
    ? 'تم الموافقة'
    : status === 'rejected'
    ? 'تم الرفض'
    : status === 'block'
    ? 'محظور'
    : status
}

/**
 * A function to get the project study case document
 * @param {string} studyCase
 * @returns {string} studyCase document path
 */
export function getProjectStudyCase(
  studyCase: Projects['shms_project_study_case']
): string {
  let imgDisplayPath = null
  try {
    imgDisplayPath = studyCase
  } catch (error: any) {
    throw new Error('Error parsing study case data:', error.message)
  }

  return imgDisplayPath[0] ? imgDisplayPath[0].imgDisplayPath : ''
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

/**
 * A function to format the price to the currency
 * @param price the price to be formatted
 * @returns the formatted price
 * */
export const formattedPrice = (price: number, maximumFractionDigits: number = 0) => {
  const formatter = new Intl.NumberFormat('ar-qa', {
    style: 'currency',
    currency: 'QAR',
    maximumFractionDigits
  })

  return formatter.format(price)
}

/**
 * A function to replace the string with the arabic string
 * @param string the string to be replaced
 * @returns the replaced string
 * */
export const replaceString = (string: string) => {
  switch (string) {
    case 'shms_sn': {
      return 'الرقم التسلسلي'
    }
    case 'shms_withdraw_id': {
      return 'الرقم المرجعي للعملية'
    }
    case 'shms_user_id': {
      return 'الرقم المرجعي للمستثمر'
    }
    case 'shms_id': {
      return 'الرقم المرجعي'
    }
    case 'shms_action_type': {
      return 'نوع العملية'
    }
    case 'shms_fullname': {
      return 'اسم المستثمر'
    }
    case 'shms_password': {
      return 'كلمة المرور'
    }
    case 'shms_date_of_birth': {
      return 'تاريخ الميلاد'
    }
    case 'shms_doc': {
      return 'صورة المستند'
    }
    case 'shms_user_stocks': {
      return 'عدد الأسهم'
    }
    case 'shms_user_stock_limit': {
      return 'الحد الأعلى للأسهم'
    }
    case 'shms_user_credits': {
      return 'الرصيد'
    }
    case 'shms_user_account_type': {
      return 'نوع الحساب'
    }
    case 'shms_user_account_status': {
      return 'حالة الحساب'
    }
    case 'shms_nationality': {
      return 'الجنسية'
    }
    case 'shms_phone': {
      return 'رقم الجوال'
    }
    case 'shms_email': {
      return 'البريد الالكتروني'
    }
    case 'shms_address': {
      return 'العنوان'
    }
    case 'shms_created_at': {
      return 'تاريخ الإنشاء'
    }
    case 'shms_withdraw_amount': {
      return 'المبلغ المراد سحبه'
    }
    case 'accounting_operation_status': {
      return 'حالة الطلب'
    }
    default: {
      return string
    }
  }
}

/**
 * A function to save the column visibility
 * @param visibilityState the visibility state to be saved
 * @returns void
 */
export function saveColumnVisibility(visibilityState: VisibilityState) {
  localStorage.setItem('columnVisibility', JSON.stringify(visibilityState))
}

/**
 * A function to load the column visibility
 * @returns the saved visibility
 */
export function loadColumnVisibility(): any {
  const savedVisibility =
    typeof window !== undefined ? localStorage.getItem('columnVisibility') : null

  return savedVisibility ? JSON.parse(savedVisibility) : {}
}

/**
 * A function to handle the Sign Out using next-auth signOut method
 * and remove the user data from the localStorage
 * @returns Promise<void>
 */
export async function handleSignOut() {
  localStorage.removeItem('shms_user_data')
  try {
    await signOut({ redirect: true, callbackUrl: APP_URL ?? '/' })
  } catch (error) {
    console.error('Sign-out error:', error)
  }
}

/**
 * Images is a function that returns an array of images in this format /slider/slider-$NUMBER_OF_IMAGE.webp
 * I will pass the number of images to the function and it will return the array of images
 * @param NUMBER_OF_IMAGES the number of images to be returned
 * @returns imagesArray the array of images
 */
export function images(NUMBER_OF_IMAGES: number): string[] {
  let imagesArray = []
  for (let i = 1; i <= NUMBER_OF_IMAGES; i++) {
    imagesArray.push(`/slider/slider-0${i}.webp`)
  }
  return imagesArray
}
