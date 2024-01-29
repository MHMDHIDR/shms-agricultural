'use client'

import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import {
  validateEmail,
  validateFile,
  validatePasswordStrength,
  validateQatarPhoneNumber
} from '@/lib/utils'
import type { UserProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import Layout from '@/components/custom/Layout'
import SelectCountry from '@/components/custom/SelectCountry'
import { Error, Success } from '@/components/icons/Status'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const SignupPage = () => {
  // Form States
  const [fName, setFName] = useState('')
  const [sName, setSName] = useState('')
  const [tName, setTName] = useState('')
  const [foName, setFoName] = useState('')
  // combine all names to one state
  const [userFullName, setUserFullName] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerm, setAcceptedTerm] = useState(false)
  const [phone, setPhone] = useState('')
  const [file, setFile] = useState<File[]>([])
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { replace } = useRouter()

  const onFileAdd = (e: { target: { files: any } }) => {
    setFile(e.target.files)
  }

  // Errors States
  const [fullNameError, setFullNameError] = useState('')
  const [fNameError, setFNameError] = useState('')
  const [sNameError, setSNameError] = useState('')
  const [tNameError, setTNameError] = useState('')

  const [nationlityError, setNationlityError] = useState('')
  const [dateOfBirthError, setDateOfBirthError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passError, setPassError] = useState('')
  const [passConfirmError, setPassConfirmError] = useState('')
  const [fileError, setFileError] = useState('')
  const [acceptedTermError, setAcceptedTermError] = useState('')

  const blurFName = (e: string) => {
    if (e === '') {
      setFNameError('الرجاء ادخال الاسم الاول')
    } else {
      setFNameError('')
    }
  }

  const blurSName = (e: string) => {
    if (e === '') {
      setSNameError('الرجاء ادخال الاسم الثاني')
    } else {
      setSNameError('')
    }
  }

  const blurTName = (e: string) => {
    if (e === '') {
      setTNameError('الرجاء ادخال الاسم الثالث')
    } else {
      setTNameError('')
    }
  }

  const blurEmail = (e: string) => {
    if (!validateEmail(e)) {
      setEmailError('الرجاء التأكد من صحة البريد الالكتروني')
    } else {
      setEmailError('')
    }
  }

  const blurAddress = () => {
    if (!address) {
      setAddressError('الرجاء التأكد من إدخال العنوان')
    } else {
      setAddressError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const blurPassword = () => {
    if (!validatePasswordStrength(password)) {
      setPassError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else {
      setPassError('')
    }
  }

  const blurConfrimPassword = () => {
    if (!validatePasswordStrength(password)) {
      setPassConfirmError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else if (password !== confirmPassword) {
      setPassConfirmError('الرجاء التأكد من تطابق كلمة المرور')
    } else {
      setPassConfirmError('')
      resetFormErrors()
    }
  }

  const blurPhone = (p: string) => {
    if (!validateQatarPhoneNumber(p)) {
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف بشكل صحيح')
    } else {
      setPhoneError('')
      resetFormErrors()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the first file uploaded
    const file = e.target.files![0]
    const { isAllowedExtension, isAllowedSize } = validateFile(file as File)

    if (!isAllowedExtension) {
      setFileError('فقط الملفات من النوع jpg, jpeg, png, pdf مسموح بها')
    } else if (!isAllowedSize) {
      setFileError('الحد الأقصى لحجم الملف هو 2 ميغابايت')
    } else {
      setFileError('')
      onFileAdd(e)
    }
  }

  useEffect(() => {
    setUserFullName(`${fName} ${sName} ${tName} ${foName}`)
  }, [fName, sName, tName, foName])

  const handelSignupForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (fName === '' || sName === '' || tName === '') {
      resetFormErrors()
      setFullNameError('الرجاء التأكد من إدخال الاسم الأول، والثاني، والثالث')
    } else if (nationality === '') {
      resetFormErrors()
      setNationlityError('الرجاء التأكد من إدخال الجنسية')
    } else if (dateOfBirth === '') {
      resetFormErrors()
      setDateOfBirthError('الرجاء التأكد من إدخال تاريخ الميلاد')
    } else if (address.length < 10) {
      resetFormErrors()
      setAddressError('الرجاء التأكد من إدخال العنوان بشكل صحيح')
    } else if (!validateEmail(email)) {
      resetFormErrors()
      setEmailError('الرجاء التأكد من صحة البريد الالكتروني')
    } else if (phone === '') {
      resetFormErrors()
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف')
    } else if (!validateQatarPhoneNumber(phone)) {
      resetFormErrors()
      setPhoneError('الرجاء التأكد من إدخال رقم الهاتف بشكل صحيح')
    } else if (password === '') {
      resetFormErrors()
      setPassError('الرجاء التأكد من إدخال كلمة المرور')
    } else if (!validatePasswordStrength(password)) {
      resetFormErrors()
      setPassError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else if (confirmPassword !== password) {
      setPassConfirmError('الرجاء التأكد من تطابق كلمة المرور')
    } else if (!validatePasswordStrength(confirmPassword)) {
      resetFormErrors()
      setPassConfirmError(
        'تأكيد كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else if (!file[0]) {
      resetFormErrors()
      setFileError('الرجاء التأكد من رفع صورة المستند الرسمي')
    } else if (!acceptedTerm) {
      resetFormErrors()
      setAcceptedTermError('الرجاء الموافقة على بنود الاستخدام وسياسة الخصوصية')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)
        const formData = new FormData()
        formData.append('fullname', userFullName)
        formData.append('multiple', 'false')
        formData.append('file', file[0]!)

        // upload the project images to s3
        const {
          data: { shms_id, shms_doc }
        }: {
          data: UserProps
        } = await axios.post(`${API_URL}/uploadToS3`, formData)
        const joinUser: { data: UserProps } = await axios.post(
          `${API_URL}/users/signup`,
          {
            shms_id,
            userFullName,
            nationality,
            dateOfBirth,
            address,
            email,
            phone,
            password,
            shms_doc
          }
        )
        //getting response from backend
        const { data } = joinUser

        // make sure to view the response from the data
        data.userAdded === 1 &&
          toast(
            'تم إرسال بريد الكتروني لتأكيد التسجيل ، الرجاء إتباع التعليمات في البريد لتفعيل حسابك 👍🏼',
            {
              icon: <Info className='text-blue-300' />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#F0FAF0',
                color: '#367E18',
                border: '1px solid #367E18',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            }
          )

        setTimeout(() => replace(`/`), DEFAULT_DURATION)
      } catch (error: any) {
        //handle error, show notification using Shadcn notifcation
        toast(JSON.stringify(error ?? 'حدث خطأ ما'), {
          icon: <Error className='w-6 h-6 ml-3' />,
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
        console.error('Error', error)
      } finally {
        setIsDoneSubmitting(true)
      }
    }
  }

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setFullNameError('')
    setNationlityError('')
    setDateOfBirthError('')
    setAddressError('')
    setEmailError('')
    setPassError('')
    setPhoneError('')
    setPhoneError('')
    setAcceptedTermError('')
  }

  return (
    <Layout>
      <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
        <CardWrapper
          headerLabel='إنضم إلينا'
          backButtonLabel='لديك حساب بالفعل؟ تسجيل الدخول'
          backButtonHref='/auth/signin'
        >
          <form
            dir='rtl'
            className='w-full max-w-fit md:m-5'
            onSubmit={e => handelSignupForm(e)}
            noValidate
          >
            <div className='mb-6'>
              {fullNameError && <FormMessage error>{fullNameError}</FormMessage>}
              {fNameError && <FormMessage error>{fNameError}</FormMessage>}
              {sNameError && <FormMessage error>{sNameError}</FormMessage>}
              {tNameError && <FormMessage error>{tNameError}</FormMessage>}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block mb-1 text-xs font-bold text-gray-500 md:text-right md:mb-0'
                  >
                    الاسم الاول
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='firstName'
                    type='text'
                    onFocus={() =>
                      ((
                        document.getElementById('firstName') as HTMLInputElement
                      ).placeholder = '')
                    }
                    onChange={e => setFName(e.target.value)}
                    onBlur={e => {
                      blurFName(e.target.value)
                      ;(
                        document.getElementById('firstName') as HTMLInputElement
                      ).placeholder = 'محمد'
                    }}
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    placeholder='محمد'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='secondName'
                    className='block mb-1 text-xs font-bold text-gray-500 md:text-right md:mb-0'
                  >
                    الاسم الثاني
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='secondName'
                    onFocus={() =>
                      ((
                        document.getElementById('secondName') as HTMLInputElement
                      ).placeholder = '')
                    }
                    onChange={e => setSName(e.target.value)}
                    onBlur={e => {
                      blurSName(e.target.value)
                      ;(
                        document.getElementById('secondName') as HTMLInputElement
                      ).placeholder = 'عبد الرحيم'
                    }}
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    placeholder='عبدالرحيم'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='thirdName'
                    className='block mb-1 text-xs font-bold text-gray-500 md:text-right md:mb-0'
                  >
                    الاسم الثالث
                    <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='thirdName'
                    onFocus={() =>
                      ((
                        document.getElementById('thirdName') as HTMLInputElement
                      ).placeholder = '')
                    }
                    onChange={e => setTName(e.target.value)}
                    onBlur={e => {
                      blurTName(e.target.value)
                      ;(
                        document.getElementById('thirdName') as HTMLInputElement
                      ).placeholder = 'محمد'
                    }}
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    placeholder='محمد'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block mb-1 text-xs font-bold text-gray-500 md:text-right md:mb-0'
                  >
                    الاسم الاخير
                  </label>
                  <input
                    id='lastName'
                    onFocus={() =>
                      ((
                        document.getElementById('lastName') as HTMLInputElement
                      ).placeholder = '')
                    }
                    onChange={e => setFoName(e.target.value)}
                    onBlur={() => {
                      ;(
                        document.getElementById('lastName') as HTMLInputElement
                      ).placeholder = 'مكي'
                    }}
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    placeholder='مكي'
                  />
                </div>
              </div>
              <div className='md:w-1/3'></div>
            </div>

            {nationlityError && <FormMessage error>{nationlityError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='nationality'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  الجنسية
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <SelectCountry
                  nationality={nationality}
                  setNationality={setNationality}
                  placeholder='إختر الجنسية ...'
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                />
              </div>
            </div>

            {dateOfBirthError && <FormMessage error>{dateOfBirthError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='dateOfBirth'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  تاريخ الميلاد
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='dateOfBirth'
                  onChange={e => setDateOfBirth(e.target.value)}
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  max={
                    new Date(
                      new Date().getFullYear() - 18,
                      new Date().getMonth(),
                      new Date().getDate()
                    )
                      .toISOString()
                      .split('T')[0]
                  }
                />
              </div>
            </div>

            {addressError && <FormMessage error>{addressError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='address'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  العنوان
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='address'
                  onFocus={() =>
                    ((
                      document.getElementById('address') as HTMLInputElement
                    ).placeholder = '')
                  }
                  onChange={e => setAddress(e.target.value)}
                  onBlur={() => {
                    blurAddress()
                    ;(
                      document.getElementById('address') as HTMLInputElement
                    ).placeholder = 'العــــنوان ...'
                  }}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='العــــنوان ...'
                  required
                />
              </div>
            </div>

            {emailError && <FormMessage error>{emailError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='email'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  البريد الالكتروني
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='email'
                  onFocus={() =>
                    ((document.getElementById('email') as HTMLInputElement).placeholder =
                      '')
                  }
                  onBlur={e => {
                    blurEmail(e.target.value)
                    ;(document.getElementById('email') as HTMLInputElement).placeholder =
                      'example@gmail.com'
                  }}
                  onChange={e => setEmail(e.target.value)}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='email'
                  placeholder='example@gmail.com'
                  required
                />
              </div>
            </div>

            {phoneError && <FormMessage error>{phoneError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='phone'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  رقم الهاتف
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='phone'
                  onFocus={() =>
                    ((document.getElementById('phone') as HTMLInputElement).placeholder =
                      '')
                  }
                  onChange={e => setPhone(e.target.value)}
                  onBlur={e => {
                    blurPhone(e.target.value)
                    ;(document.getElementById('phone') as HTMLInputElement).placeholder =
                      '55123456'
                  }}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  dir='rtl'
                  type='tel'
                  placeholder='55123456'
                  required
                />
              </div>
            </div>

            {passError && <FormMessage error>{passError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='password'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  كلمة المرور
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='password'
                  onChange={handlePasswordChange}
                  onBlur={blurPassword}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='password'
                  placeholder='******'
                />
              </div>
            </div>

            {passConfirmError && <FormMessage error>{passConfirmError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='confirmPassword'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  التأكد من كلمة المرور
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='confirmPassword'
                  onChange={handleConfirmPasswordChange}
                  onBlur={blurConfrimPassword}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='password'
                  placeholder='******'
                  required
                />
              </div>
            </div>

            {fileError && <FormMessage error>{fileError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='document'
                  className='block mb-1 font-bold text-gray-500 cursor-pointer md:text-right md:mb-0'
                >
                  صورة المستند الرسمي
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <Input
                  id='document'
                  type='file'
                  aria-label='file'
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded cursor-pointer dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            {acceptedTermError && <FormMessage error>{acceptedTermError}</FormMessage>}
            <div className='flex-col items-start w-full gap-2 mb-6 md:flex'>
              <label
                htmlFor='accept_termsAndPrivacy'
                className='block mb-1 font-bold text-gray-500 cursor-pointer md:text-right md:mb-0'
              >
                <Checkbox
                  id='accept_termsAndPrivacy'
                  className='ml-2'
                  onCheckedChange={(isChecked: boolean) => setAcceptedTerm(isChecked)}
                  required
                />
                أوافق على &nbsp;
                <Link href='/terms' className='font-bold underline-hover'>
                  بنود الاستخدام
                </Link>
                &nbsp; و &nbsp;
                <Link href='/privacy' className='font-bold underline-hover'>
                  سياسة الخصوصية
                </Link>
                <span className='text-red-500'>*</span>
              </label>
              <div className='md:w-1/3'></div>
            </div>

            {/* Submit Button */}
            <div className='md:flex md:items-center'>
              <Button
                disabled={isDoneSubmitting}
                type='submit'
                className={`shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold${
                  isDoneSubmitting ? ' cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSubmittingForm ? (
                  <>
                    <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                    جاري التسجيل ...
                  </>
                ) : isDoneSubmitting ? (
                  <>
                    <Success />
                    تم التسجيل يرجى تفعيل حسابك
                  </>
                ) : (
                  'تسجيل'
                )}
              </Button>
            </div>

            <div className='flex justify-between w-full my-4'>
              <Link
                href='/auth/signin'
                className='text-sm text-gray-500 transition-colors hover:text-gray-700'
              >
                لديك حساب؟ سجل دخولك
              </Link>
            </div>
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}

export default SignupPage
