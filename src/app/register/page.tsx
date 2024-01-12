'use client'
import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const router = useRouter()

  // Form Submit
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    // make sure the clerk instance is loaded.
    if (!isLoaded) return

    try {
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        password
      })

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // change the UI to our pending section.
      setPendingVerification(true)
    } catch (err) {
      console.error(err)
    }
  }

  // Verify User Email Code
  const onPressVerify = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // make sure the clerk instance is loaded.
    if (!isLoaded) return

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignUp.status !== 'complete') {
        console.error(
          'Error completing sign up=>' + JSON.stringify(completeSignUp, null, 2)
        )
      }

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/')
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <section className='border p-5 rounded max-w-lg container text-right'>
      <h1 className='text-2xl mb-4'>تسجيل</h1>
      {!pendingVerification && (
        <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
          <div>
            <label
              htmlFor='first_name'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              الإسم الأول
            </label>
            <input
              type='text'
              name='first_name'
              id='first_name'
              onChange={e => setFirstName(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor='last_name'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              الإسم الأخير
            </label>
            <input
              type='text'
              name='last_name'
              id='last_name'
              onChange={e => setLastName(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              البريد الإلكتروني
            </label>
            <input
              type='email'
              name='email'
              id='email'
              onChange={e => setEmail(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
              placeholder='name@company.com'
              dir='rtl'
              required={true}
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              كلمة المرور
            </label>
            <input
              type='password'
              name='password'
              id='password'
              onChange={e => setPassword(e.target.value)}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5'
              required={true}
            />
          </div>
          <button
            type='submit'
            className='w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          >
            إنشاء حساب جديد
          </button>
        </form>
      )}
      {pendingVerification && (
        <div>
          <form className='space-y-4 md:space-y-6'>
            <input
              value={code}
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5'
              placeholder='Enter Verification Code...'
              onChange={e => setCode(e.target.value)}
            />
            <button
              type='submit'
              onClick={onPressVerify}
              className='w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
            >
              تأكيد البريد الإلكتروني
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

export default RegisterPage
