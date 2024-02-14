import { APP_TITLE } from '@/data/constants'
import { customEmailProps } from '@/types'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Tailwind
} from '@react-email/components'
import Link from 'next/link'

const baseUrl = process.env.NEXT_PUBLIC_APP_PUBLIC_URL ?? ''

export const EmailTemplate = ({
  title,
  msg,
  buttonLink,
  buttonLabel
}: customEmailProps) => {
  const formattedMsg = msg ? msg.replace(/\n/g, '<br>') : ''

  return (
    <Html>
      <Tailwind>
        <Head>
          <link
            href='https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
            rel='stylesheet'
          />
        </Head>
        <Body>
          <Container className='max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900 rtl font-[Cairo,_sans-serif]'>
            <Section key='section1' className='text-center'>
              <Img
                src={`${baseUrl}/logo-slogan.png`}
                width={250}
                className='w-auto h-7 sm:h-8 mx-auto rtl'
              />
            </Section>

            <Section key='section2' className='mt-8'>
              <div className='bg-gray-50 rtl dark:bg-gray-700 shadow-md rounded-lg p-6'>
                <Heading as='h2' className='text-center' key='h2'>
                  {title ?? 'طلب استعادة كلمة المرور'}
                </Heading>

                <br />

                <Text
                  key='text'
                  className='mt-4 rtl leading-loose text-gray-600 dark:text-gray-300 text-right'
                >
                  {/* Use the formatted message with HTML line breaks */}
                  {msg ? (
                    <div dangerouslySetInnerHTML={{ __html: formattedMsg }} />
                  ) : (
                    `لا يمكننا ببساطة أن نرسل لك كلمة المرور القديمة.
                    رابط فريد تم إنشاؤه لك. لإعادة تعيين كلمة المرور الخاصة بك، انقر على
                    الرابط التالي واتبع التعليمات.`
                  )}
                </Text>

                {buttonLink && (
                  <div key='buttonLabel' className='text-center mt-6'>
                    <Button className='px-6 py-2 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'>
                      <Link href={buttonLink} target='_blank'>
                        {buttonLabel ?? 'إعادة تعيين كلمة المرور'}
                      </Link>
                    </Button>
                  </div>
                )}

                {buttonLink && (
                  <Text
                    key='buttonLink'
                    className='mt-4 text-gray-600 dark:text-gray-300 text-right'
                  >
                    يمكنك أيضًا نسخ ولصق عنوان URL أدناه:
                    <br /> <br />
                    <strong>{buttonLink}</strong>
                  </Text>
                )}
              </div>
            </Section>

            <Section key='section3' className='mt-8'>
              <Text className='text-gray-500 dark:text-gray-400 text-center'>
                {APP_TITLE}
                <br />
                جميع الحقوق محفوظة © {new Date().getFullYear()}
              </Text>

              {buttonLink &&
                (buttonLink.includes('reset-password') ||
                  buttonLink.includes('activate')) && (
                  <Text className='mt-2 text-sm text-gray-500 dark:text-gray-400 text-center'>
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
