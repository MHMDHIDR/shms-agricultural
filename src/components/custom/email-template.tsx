import { APP_TITLE } from '@/data/constants'
import { customEmailProps } from '@/types'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Tailwind
} from '@react-email/components'

const baseUrl = process.env.NEXT_PUBLIC_APP_PUBLIC_URL ?? ''

export const EmailTemplate = ({
  title,
  msg,
  buttonLink,
  buttonLabel
}: customEmailProps) => {
  const formattedMsg = msg
    ? typeof msg === 'string'
      ? msg.replace(/\n/g, '<br>')
      : msg
    : ''

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body>
          <Container
            className='max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900'
            style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}
          >
            <Section key='section1' className='text-center'>
              <Img
                src={`${baseUrl}/logo-slogan.png`}
                width={150}
                className='w-auto h-20 sm:h-16 mx-auto rtl'
              />
            </Section>

            <Section key='section2' className='mt-8'>
              <div className='bg-gray-50 rtl dark:bg-gray-700 shadow-md rounded-lg p-6'>
                <Heading as='h2' className='text-center' key='h2'>
                  {title ?? 'طلب استعادة كلمة المرور'}
                </Heading>

                <br />

                <Text
                  key='msg'
                  className='mt-4 rtl leading-loose text-gray-700 dark:text-gray-300 text-right'
                >
                  {/* Use the formatted message with HTML line breaks */}
                  {msg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: formattedMsg }}
                      className='leading-10'
                    />
                  ) : (
                    `لا يمكننا ببساطة أن نرسل لك كلمة المرور القديمة.
                    رابط فريد تم إنشاؤه لك. لإعادة تعيين كلمة المرور الخاصة بك، انقر على
                    الرابط التالي واتبع التعليمات.`
                  )}
                </Text>

                {buttonLink && (
                  <div className='text-center my-7' key='buttonDiv'>
                    <a
                      className='px-6 no-underline rounded-lg bg-blue-500 hover:bg-blue-700 hover:-translate-y-1.5 py-2 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
                      href={buttonLink}
                      target='_blank'
                    >
                      {buttonLabel ?? 'إعادة تعيين كلمة المرور'}
                    </a>
                  </div>
                )}

                {buttonLink && (
                  <>
                    <Text
                      key='buttonLink'
                      className='mt-4 text-gray-400 dark:text-gray-300 text-right'
                    >
                      يمكنك أيضًا نسخ ولصق عنوان URL أدناه:
                      <br /> <br />
                      <strong>{buttonLink}</strong>
                    </Text>

                    <small className='inline-block w-full text-center text-xxs text-gray-400 dark:text-white'>
                      إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك
                      مشكلة ما، يرجى تجاهل هذا البريد من فضلك!
                    </small>
                  </>
                )}
              </div>
            </Section>

            <Section key='section3' className='mt-8'>
              <Text
                key='section3rights'
                className='text-gray-500 dark:text-gray-400 text-center'
              >
                {APP_TITLE}
                <br />
                جميع الحقوق محفوظة © {new Date().getFullYear()}
              </Text>

              {buttonLink &&
                (buttonLink.includes('reset-password') ||
                  buttonLink.includes('activate')) && (
                  <Text
                    className='mt-2 text-sm text-gray-500 dark:text-gray-400 text-center'
                    key='note'
                  >
                    <br />
                    <small>ملاحظة: هذا الرابط سيتنهي خلال ساعة واحدة</small>
                  </Text>
                )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
