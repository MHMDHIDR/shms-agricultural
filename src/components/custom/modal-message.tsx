import { LegacyRef, forwardRef } from 'react'

import { ModalProps } from '@/types'
import { Loading } from '../icons/status'

const ModalMessage = forwardRef(
  (
    {
      children = ``,
      extraComponents,
      status = <Loading />,
      modalHidden = '',
      className,
      redirectLink,
      redirectTime = 2500,
      btnName = '',
      btnLink = '/'
    }: ModalProps,
    ref: LegacyRef<HTMLElement>
  ) => {
    if (redirectLink && redirectTime) {
      setTimeout(() => window.location.assign(redirectLink), redirectTime)
    }

    return (
      <section
        ref={ref}
        id='modal'
        className={`fixed inset-0 p-0 m-0 min-h-screen min-w-screen z-[9999999] bg-gray-500 opacity-95 ${
          modalHidden.includes('hidden') ? 'hidden' : ''
        } flex items-center`}
      >
        <div className='container mx-auto'>
          <div
            className='p-6 mx-12 text-center text-black bg-gray-200 border border-gray-400 rounded-lg shadow-lg dark:bg-gray-700 dark:text-gray-300 dashed'
            aria-modal='true'
          >
            <div className='flex justify-center'>{status}</div>
            <pre className='py-8 whitespace-pre-line leading-9' dir='auto'>
              <p className={className}>{children}</p>
            </pre>
            {extraComponents && extraComponents}
            {btnName && btnLink ? (
              <a
                href={btnLink}
                className='inline-block px-5 py-1 text-white bg-green-600 rounded-md hover:bg-green-700'
              >
                {btnName}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    )
  }
)

ModalMessage.displayName = 'ModalMessage'

export default ModalMessage
