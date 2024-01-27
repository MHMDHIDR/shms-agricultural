import axios from 'axios'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_URL } from '@/data/constants'
import type { DocImgsProps, FileUploadProps, uploadurlDataProps } from '@/types'

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
 * a function to upload files to S3 bucket
 * and returns projectImages object (array)
 */

export const uploadS3 = async (file: FileUploadProps['file']) => {
  if (file.length === 0) return { projectImages: [] }

  const fileFormData = new FormData()

  const fileData = JSON.stringify(
    file.map((file: { name: string; type: string }) => {
      return { key: file?.name, type: file?.type }
    })
  )

  const { data }: uploadurlDataProps = await axios.get(
    `${API_URL}/uploadurl?file=${fileData}`
  )

  async function uploadToS3(url: string) {
    await axios.post(url, fileFormData)
  }

  data.map(({ fields, url }: any, idx: number) => {
    Object.entries({ ...fields, file: file[idx] }).forEach(([key, value]) => {
      fileFormData.set(key, value as string)
    })
    return uploadToS3(url)
  })

  const projectImages: DocImgsProps[] = data.map(({ fields, url }) => {
    const urlSplit = (n: number) => url.split('/')[n]
    return {
      docImgDisplayName: fields.key,
      docImgDisplayPath: `${urlSplit(0)}//${fields.bucket}.${urlSplit(2)}/${fields.key}`
    }
  })

  return { projectImages }
}
