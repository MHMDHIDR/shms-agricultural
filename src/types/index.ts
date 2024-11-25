import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import type { ButtonProps } from '@/components/ui/button'
import type { Projects, Users } from '@prisma/client'

export type getAuthType = {
  userId: Users['id']
  isAuth: Users['loggedIn'] | boolean
  userType: Users['shms_user_account_type']
  userName?: Users['shms_fullname']
  userEmail?: Users['shms_email']
  userPhone?: Users['shms_phone']
  userStockLimit?: Users['shms_user_stock_limit']
  totalCredits?: Users['shms_user_credits']
  loading: boolean
}

export type getAuthProps = () => Promise<getAuthType>

export type accountingOperationsProps = {
  shms_user_id?: Users['id']
  shms_withdraw_id: string
  shms_action_type: 'withdraw' | 'deposit'
  shms_fullname: Users['shms_fullname']
  shms_phone: Users['shms_phone']
  shms_email: Users['shms_email']
  shms_address: Users['shms_address']
  shms_created_at: string
  shms_withdraw_amount: number
  accounting_operation_status: 'pending' | 'completed' | 'rejected' | 'deleted'
  // When withdraw action happens
  message?: string
  // When withdraw is added, this is set to 1
  withdrawAdded?: number
  // When withdraw is updated, this is set to 1
  withdrawUpdated?: number
}

export type shms_formSignupDataProps = {
  fName: string
  sName: string
  tName: string
  foName: string
  email: string
  nationality: string
  dateOfBirth: string
  address: string
  password: string
  confirmPassword: string
  acceptedTerm: boolean
  phone: string
}

export type UserLoggedInProps =
  | (Session & {
      token?: JWT & {
        user: Users
      }
    })
  | null

export type FileUploadProps = {
  file: File[]
  fileURLs: string[]
  setFile?: (file: File[]) => void
  setFileURLs(fileURLs: string[]): void
  onFileAdd?: (e: { target: { files: any } }) => void
  onFileRemove(fileUrl: string, fileName: string): void
}

export type FormStatusProps = {
  formStatus: {
    isSubmitting: boolean
    isSubmittingDone: boolean
  }
  setFormStatus: React.Dispatch<
    React.SetStateAction<{
      isSubmitting: boolean
      isSubmittingDone: boolean
    }>
  >
}

export type FileUploadComponentProps = {
  data: {
    projectId?: string
    imgName: string
    defaultImg: imgsProps[]
  }
  ignoreRequired?: boolean
  id?: string
  setIsRefetching: React.Dispatch<React.SetStateAction<boolean>> | undefined
}

export type fileRequestProps = NextApiRequest & {
  key: string
  type: string
}

export type imgsProps = {
  imgDisplayName: string
  imgDisplayPath: string
}

export type uploadFileToS3Props = {
  file: Buffer
  isCaseStudyIncluded?: boolean
  multiple: boolean
  fileObject: File
  fullname?: string
  projectId?: string | undefined
}

// User Email
export type emailMethodProps = {
  name?: string
  subject: string
  from: string
  to: string
  msg: customEmailProps
  pdfToSend?: Buffer
}

export type customEmailProps = {
  title?: string
  msg?: string | HTMLElement
  buttonLink?: string
  buttonLabel?: string
}

export type emailProps = {
  emailOrPhone: string
  address: string
  message: string
  mailSent?: number
}

export interface CreateEmailResponse {
  data: {
    id: string
  } | null
  error: {
    message: string
    name: any
  } | null
}

export type MenuItemsProps = {
  title: string
  href: string
  description: string
}[]

export type NoItemsProps = {
  className?: string
  msg?: string
  links?: {
    to: string
    label: string
  }[]
  button?: React.ReactNode
}

export type allowedExtensions = string[] | undefined

export type validateFileProps = (
  file: File,
  allowedExtensions?: allowedExtensions
) => {
  isAllowedExtension: boolean
  isAllowedSize: boolean
  allowedExtensions?: allowedExtensions
}

export type abstractWordsProps = (props: {
  words: string
  wordsLength: number
  ellipsis: boolean
}) => string

export type ConfirmProps = {
  message?: string
  isLoading?: boolean
  onClick: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => Promise<void>)
  variant?: ButtonProps['variant']
  className?: string
  children: string | React.ReactNode
  imageId?: string
  shmsProjectImages?: string
  formStatus?: { isSubmitting: boolean; isSubmittingDone: boolean }
}

export type purchasedStocksData = {
  investorName: string
  projectName: string
  stocksPurchased: number
  totalAmount: number
  totalProfit: number
  profitsCollectDate: Date
  referenceCode: string
  message: string
}

export type stocksPurchasedProps = {
  userId?: Users['id']
  id: Projects['id']
  stocks: number
  newPercentage: number
  percentageCode: string
  totalPaymentAmount: number
  paymentMethod: selectedPaymentOptions
  createdAt: string
}

export type ModalProps = {
  children?: string
  extraComponents?: React.ReactNode
  status?: React.ReactNode
  modalHidden?: string
  className?: string
  redirectLink?: string
  redirectTime?: number
  btnName?: string
  btnLink?: string
}

export type InverstorProjectData = {
  projectId: string
  projectName: string
  projectStockPrice: number
  stocks: number
  totalPayment: number
  profitCollectionDate: Date
  projectTerms: string
  purchaseDate: Date
  profitPerStock: number
  totalProfit: number
}

export type generatePDFProps = {
  investorName: string
  projectName: string
  investorPhone?: string
  investorEmail?: string
  stocksPurchased: number
  totalAmount: number
  profitPerStock: number
  totalProfit: number
  purchaseDate: Date
  profitsCollectDate: Date
  projectTerms?: string
  referenceCode: string
}

export type selectedPaymentOptions = 'visa' | 'credit' | 'cash' | 'balance'

export type ProjectPlannerAIEndpoint = {
  projectId: 'j570e6arxv5pjg7gxgk4akkq356w9vsq'
  feedback: string
  title?: string
  name?: string
  email?: string
  label: ProjectPlannerAILabel
  status?: ProjectPlannerAIStatus
}

enum ProjectPlannerAILabel {
  issue = 'issue',
  idea = 'idea',
  question = 'question',
  complaint = 'complaint',
  featureRequest = 'featureRequest',
  other = 'other'
}

enum ProjectPlannerAIStatus {
  needsReview = 'needsReview',
  workItemCreated = 'workItemCreated',
  closed = 'closed'
}
