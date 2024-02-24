import type { ButtonProps } from '@/components/ui/button'
import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type UserProps = {
  shms_id: string
  shms_fullname: string
  fullname?: string
  shms_nationality: string
  shms_date_of_birth: Date
  shms_email: string
  shms_password?: string
  shms_phone?: string
  shms_address?: string
  shms_user_stocks?: stocksPurchasedProps[]
  shms_user_stock_limit?: number
  shms_user_total_balance?: number
  shms_user_withdrawable_balance: number
  shms_doc?: string
  shms_created_at?: string
  shms_user_account_type?: 'admin' | 'user'
  shms_user_account_status?: 'active' | 'block' | 'pending'
  shms_user_reset_token?: string
  shms_user_reset_token_expires?: number
  // When user action happens
  message?: string
  // When user is logged in, this is set to 1
  loggedIn?: number
  // When user is registered, this is set to 1
  userAdded?: number
  // When user is updated, this is set to 1
  userUpdated?: number
  // When user is activated, this is set to 1
  userActivated?: number
  // When user forgot password, this is set to 1
  userWithdrawnBalance?: number
  // When user forgot password, this is set to 1
  forgotPassSent?: number
  // When user reset password, this is set to 1
  newPassSet?: number
  // When user changes their email, this is set to 1
  resetEmail?: number
  // When user is delete, this is set to 1
  userDeleted?: number
}

export type getAuthType = {
  userId: UserProps['shms_id']
  isAuth: UserProps['loggedIn'] | boolean
  userType: UserProps['shms_user_account_type']
  userName?: UserProps['shms_fullname']
  userEmail?: UserProps['shms_email']
  userPhone?: UserProps['shms_phone']
  userStockLimit?: UserProps['shms_user_stock_limit']
  withdrawableAmount?: UserProps['shms_user_withdrawable_balance']
  loading: boolean
}

export type getAuthProps = () => Promise<getAuthType>

export type ProjectProps = {
  shms_project_id: string
  shms_project_images: imgsProps[]
  shms_project_study_case: imgsProps[]
  shms_project_study_case_visibility: number
  shms_project_name: string
  shms_project_location: string
  shms_project_start_date: Date
  shms_project_end_date: Date
  shms_project_invest_date: Date
  shms_project_profits_collect_date: Date
  shms_project_available_stocks: number
  shms_project_total_stocks: number
  shms_project_stock_price: number
  shms_project_stock_profits: number
  shms_project_special_percentage: number
  shms_project_special_percentage_code: string
  shms_project_description: string
  shms_project_terms: string
  shms_project_status: 'active' | 'pending'
  // only update Image
  updateImg?: boolean
  // only update Percentage
  updatePercentage?: boolean
  // When project is added, this is set to 1
  projectAdded?: number
  // When project is updated, this is set to 1
  projectUpdated?: number
  // When project is deleted, this is set to 1
  projectDeleted?: number
  // When a project action happens
  message?: string
}

export type accountingOperationsProps = {
  shms_withdraw_id: string
  shms_created_at: string
  shms_user_id: UserProps['shms_id']
  shms_withdraw_amount: number
  shms_action_type: 'withdraw' | 'deposit'
  accounting_operation_status: 'pending' | 'completed' | 'rejected' | 'deleted'
  // when rejecting add a reason
  withdraw_reject_reason?: string
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
        user: UserProps
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

export type FileUploadComponentProps = {
  data: {
    projectId?: string
    imgName: string
    defaultImg: imgsProps[]
  }
  ignoreRequired?: boolean
  id?: string
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

export type uploadToS3DataProps = {
  data: {
    map(arg0: ({ fields, url }: any, idx: number) => Promise<void>): unknown
    fields: {
      'Content-Type': string
      'PolicyX-Amz-Algorithm': string
      'X-Amz-Credential': string
      'X-Amz-Date': string
      'X-Amz-Signature': string
      bucket: string
      key: string
    }
    url: string
  }[]
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
}

export type stocksPurchasedProps = {
  userId?: UserProps['shms_id']
  shms_project_id: ProjectProps['shms_project_id']
  stocks: number
  newPercentage: number
  percentageCode: string
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
  purchaseDate: string
  totalProfit: number
}

export type generatePDFProps = {
  investorName: string
  projectName: string
  investorPhone?: string
  investorEmail?: string
  stocksPurchased: number
  totalAmount: number
  totalProfit: number
  profitsCollectDate: Date
  projectTerms?: string
  referenceCode: string
}

export type selectedPaymentOptions = 'visa' | 'credit' | 'cash' | 'balance'
