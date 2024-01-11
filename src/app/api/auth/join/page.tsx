'use client'
import { useState, useRef } from 'react'
import { useRouter, redirect } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Notification from 'components/Notification'
import { LoadingSpinner, LoadingPage } from 'components/Loading'
import { EyeIconClose, EyeIconOpen } from 'components/Icons/EyeIcon'
import useDocumentTitle from 'hooks/useDocumentTitle'
import useAuth from 'hooks/useAuth'
import { API_URL, PHONE_NUM_EXAMPLE, USER } from '@constants'
import { validEmail, validPhone } from 'utils/functions/validForm'
import { UserProps } from '@types'

const Join = () => {
  useDocumentTitle('Join')
  const router = useRouter()
  const { loading, userId } = useAuth()

  // if user is logged in, redirect to home page
  if (USER._id || userId) {
    redirect('/')
  }

  const [userFullName, setFullName] = useState('')
  const [userEmail, setEmail] = useState('')
  const [userTel, setTel] = useState('')
  const [userPassword, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSendingJoinForm, setIsSendingJoinForm] = useState(false)
  const [regStatus, setRegStatus] = useState(0)
  const [errMsg, setErrMsg] = useState('')

  const personUserErr = useRef<HTMLSpanElement>(null)
  const personPhoneErr = useRef<HTMLSpanElement>(null)
  const personEmailErr = useRef<HTMLSpanElement>(null)

  const handleJoin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (
      personUserErr.current!.textContent === '' &&
      personPhoneErr.current!.textContent === '' &&
      personEmailErr.current!.textContent === ''
    ) {
      setIsSendingJoinForm(true)

      try {
        const joinUser: { data: UserProps } = await axios.post(`${API_URL}/users/join`, {
          userFullName,
          userEmail,
          userTel,
          userPassword
        })
        //getting response from backend
        const { data } = joinUser
        setRegStatus(data.userAdded ?? regStatus)

        //if user is joined correctly
        setErrMsg(data.message ?? errMsg)

        //redirect to login page after 2 seconds
        data.userAdded === 1 &&
          setTimeout(() => {
            router.push(`/auth/login`)
          }, 2000)
      } catch (response: any) {
        setErrMsg(
          response?.response?.status === 409
            ? 'Sorry, this email is already taken'
            : response?.response?.status === 400
            ? 'Please fill all fields correctly'
            : response?.response?.statusText
        )
      } finally {
        setIsSendingJoinForm(false)
      }
    }
  }

  // if done loading (NOT Loading) then show the login form
  return !loading ? (
    <>
      <Header />
      <section className='py-12 my-8'>
        <div className='container mx-auto'>
          <Notification sendStatus={regStatus || 0} sendStatusMsg={errMsg} />
          <h3
            className='mx-0 mt-4 mb-12 text-2xl text-center md:text-3xl'
            data-section='login'
          >
            Join Our Community
          </h3>
          <div className='max-w-6xl mx-auto'>
            <form className='mt-32' onSubmit={handleJoin}>
              <label htmlFor='name' className='form__group'>
                <input
                  className='form__input'
                  id='name'
                  name='name'
                  type='text'
                  onChange={e => setFullName(e.target.value)}
                  autoFocus
                  onKeyUp={(e: any) => {
                    const target = e.target.value.trim()

                    if (target.length > 0 && target.length < 4) {
                      personUserErr.current!.textContent = 'Please enter a valid name'
                    } else if (target.length > 30) {
                      personUserErr.current!.textContent =
                        'The name is too long, please add a name of up to 30 characters'
                    } else {
                      personUserErr.current!.textContent = ''
                    }
                  }}
                  required
                />
                <span className='form__label'>Name</span>
                <span
                  className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                  ref={personUserErr}
                ></span>
              </label>

              <label htmlFor='email' className='form__group'>
                <input
                  className='form__input'
                  id='email'
                  name='email'
                  type='text'
                  onChange={e => setEmail(e.target.value)}
                  dir='auto'
                  onKeyUp={(e: any) => {
                    const target = e.target.value.trim()

                    if (!validEmail(target)) {
                      personEmailErr.current!.textContent = `Please Enter a Valid Email`
                    } else {
                      personEmailErr.current!.textContent = ''
                    }
                  }}
                  required
                />
                <span className='form__label'>Email</span>
                <span
                  className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                  ref={personEmailErr}
                ></span>
              </label>

              <label htmlFor='tel' className='form__group'>
                <input
                  className='form__input'
                  id='tel'
                  name='tel'
                  type='tel'
                  onChange={e => setTel(e.target.value)}
                  dir='auto'
                  onKeyUp={(e: any) => {
                    const target = e.target.value.trim()
                    const NUM_LENGTH = 10

                    if (target.length > 0 && target.length < NUM_LENGTH) {
                      personPhoneErr.current!.textContent =
                        'Please enter a phone number in the same format as the phone number in the example'
                    } else if (!validPhone(target, NUM_LENGTH)) {
                      personPhoneErr.current!.textContent = `Phone Number is Invalid! Phone Number must be a valid number`
                    } else {
                      personPhoneErr.current!.textContent = ''
                    }
                  }}
                  required
                />
                <span className='form__label'>
                  Phone Number, (e.g: {PHONE_NUM_EXAMPLE})
                </span>
                <span
                  className='inline-block md:text-lg text-red-600 dark:text-red-400 font-[600] pt-2 px-1'
                  ref={personPhoneErr}
                ></span>
              </label>

              <label htmlFor='password' className='form__group'>
                <input
                  className='form__input'
                  id='password'
                  name='password'
                  minLength={6}
                  type={passwordVisible ? 'text' : 'password'}
                  onChange={e => setPassword(e.target.value)}
                  dir='auto'
                  required
                />
                <span
                  className={`absolute cursor-pointer px-2 text-xs text-black capitalize transition-all bg-gray-200 select-none sm:text-sm md:text-lg dark:text-gray-100 dark:bg-gray-800 opacity-60 right-1`}
                  onClick={() => setPasswordVisible(prevState => !prevState)}
                >
                  {passwordVisible ? (
                    <EyeIconClose className={`stroke-red-700 dark:stroke-red-400`} />
                  ) : (
                    <EyeIconOpen className={`fill-green-700 dark:fill-green-400`} />
                  )}
                </span>
                <span className='form__label'>Password</span>
              </label>

              <div className='flex flex-col gap-6 text-center border-none form__group'>
                <button
                  className={`w-fit mx-auto px-12 py-3 text-white uppercase bg-orange-700 rounded-lg hover:bg-orange-800 scale-100 transition-all`}
                  type='submit'
                  id='submitBtn'
                >
                  {isSendingJoinForm && isSendingJoinForm ? (
                    <>
                      <LoadingSpinner />
                      &nbsp;Joining...
                    </>
                  ) : (
                    'Join'
                  )}
                </button>

                <strong className='block mx-auto my-8 text-orange-800 dark:text-orange-600 w-fit'>
                  OR
                </strong>

                <div className='flex items-center sm:gap-y-12 gap-x-6 justify-evenly'>
                  <Link
                    href='/auth/login'
                    className='mx-auto text-center text-orange-700 underline-hover dark:text-orange-800 sm:dark:text-orange-500 w-fit'
                  >
                    Login Now and Order
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  ) : (
    <LoadingPage />
  )
}
export default Join
