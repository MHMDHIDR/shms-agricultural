import { APP_LOGO, APP_TITLE } from '@/data/constants'
import { customEmailProps } from '@/types'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text
} from '@react-email/components'

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
      <Head>
        <meta charSet='UTF-8' />
        <style>
          {`.button-link:hover {
            backgroundColor: #2563eb;
          }`}
        </style>
      </Head>
      <Body>
        <Container
          style={{
            maxWidth: '42rem',
            padding: '1.5rem',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            direction: 'rtl',
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          <Section key='section1' style={{ textAlign: 'center' }}>
            <Img
              src={APP_LOGO}
              width={150}
              style={{
                width: 'auto',
                height: '5rem',
                margin: '0 auto',
                marginTop: '1rem'
              }}
            />
          </Section>

          <Section key='section2' style={{ marginTop: '2rem' }}>
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 0 1rem 0 rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9fafb',
                direction: 'rtl'
              }}
            >
              <Heading
                as='h2'
                style={{ textAlign: 'center', userSelect: 'none' }}
                key='h2'
              >
                {title ?? 'طلب استعادة كلمة المرور'}
              </Heading>

              <br />

              <Text
                key='msg'
                style={{
                  marginTop: '1rem',
                  lineHeight: '1.5',
                  textAlign: 'right',
                  color: '#374151'
                }}
              >
                {/* Use the formatted message with HTML line breaks */}
                {msg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: formattedMsg }}
                    style={{ lineHeight: '2' }}
                  />
                ) : (
                  `لا يمكننا ببساطة أن نرسل لك كلمة المرور القديمة.
                  رابط فريد تم إنشاؤه لك. لإعادة تعيين كلمة المرور الخاصة بك، انقر على
                  الرابط التالي واتبع التعليمات.`
                )}
              </Text>

              {buttonLink && (
                <div
                  style={{ textAlign: 'center', marginTop: '1.75rem' }}
                  key='buttonDiv'
                >
                  <a
                    className='button-link'
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      letterSpacing: '0.025rem',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease-in-out',
                      outline: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
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
                    style={{ marginTop: '1rem', textAlign: 'right', color: '#9ca3af' }}
                  >
                    يمكنك أيضًا نسخ ولصق عنوان URL أدناه:
                    <br /> <br />
                    <strong>{buttonLink}</strong>
                  </Text>

                  <small
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '0.625rem'
                    }}
                  >
                    إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك مشكلة
                    ما، يرجى تجاهل هذا البريد من فضلك!
                  </small>
                </>
              )}
            </div>
          </Section>

          <Section key='section3' style={{ marginTop: '2rem' }}>
            <Text key='section3rights' style={{ textAlign: 'center', color: '#9ca3af' }}>
              {APP_TITLE}
              <br />
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </Text>

            {buttonLink &&
              (buttonLink.includes('reset-password') ||
                buttonLink.includes('activate')) && (
                <Text
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    color: '#9ca3af'
                  }}
                  key='note'
                >
                  <br />
                  <small>ملاحظة: هذا الرابط سيتنهي خلال ساعة واحدة</small>
                </Text>
              )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
