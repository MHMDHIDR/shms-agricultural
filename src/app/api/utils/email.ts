import { createTransport } from 'nodemailer'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { customEmailProps } from '@/types'

const email = async ({ name, subject, from, to, msg }: any) => {
  /**
   * @returns {Promise<any>} JSON
   */

  to = to
  from = from ?? ADMIN_EMAIL
  name = name || to

  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  })

  // send mail with defined transport object
  const emailResponse = await transporter.sendMail({
    subject,
    from: `"${name}" <${from}>`,
    to,
    html: msg
  })

  return emailResponse
}

/**
 * Custom email template for sending emails to users
 * Version 20.jan.2024
 * @param {string} props.title Title of the email
 * @param {string} props.msg Message content of the email
 * @param {string} props.buttonLink Link to be used in the email
 * @param {string} props.buttonLabel Label of the button
 * @param {string} props.logoSrc Logo source
 * @returns {string} HTML
 */
export const customEmail: customEmailProps = ({
  title,
  msg,
  buttonLink,
  buttonLabel = 'إعادة تعيين كلمة المرور',
  logoSrc
}) => {
  return `
<!doctype html>
<html lang="ar" dir="rtl">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta name="description" content="Reset Password Email Template.">
    <title>Reset Password Email Template</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <style type="text/css">
        * { margin: 0; padding: 0; direction: rtl; line-height: 2.5; font-family: 'Cairo', sans-serif; box-sizing: border-box; }
        a:hover {text-decoration: underline !important;}
        .cta__button:hover {background: #50d56d !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="${APP_URL}" title="logo" target="_blank">
                            ${
                              logoSrc
                                ? `<img width="250" src="${logoSrc}" title="logo" alt="شمس الزراعية | Shms Agricultural">`
                                : `<img width="250" src="https://shms-uploads.s3.eu-west-2.amazonaws.com/logo-slogan.png" title="logo" alt="شمس الزراعية | Shms Agricultural">`
                            }
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                            ${title ?? 'طلب استعادة كلمة المرور'}
                                        </h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            ${
                                              msg ??
                                              `لا يمكننا ببساطة أن نرسل لك كلمة المرور القديمة.
                                              رابط فريد تم إنشاؤه لك. لإعادة تعيين كلمة المرور الخاصة بك، انقر على
                                             الرابط التالي واتبع التعليمات.`
                                            }
                                        </p>
                                        ${
                                          buttonLink
                                            ? `<a href="${buttonLink}"
                                                class="cta__button"
                                                style="background: #008f1f;text-decoration: none !important;font-weight:700;margin-top:35px;color:#fff;font-size:14px;padding:10px 64px;display:inline-block;border-radius: 50px;"
                                                target="_blank">
                                            ${buttonLabel ?? 'إعادة تعيين كلمة المرور'}
                                            </a>`
                                            : ''
                                        }
                                        ${
                                          buttonLink
                                            ? `
                                             <br /> <br />
                                            <p"
                                                style="margin-top:35px;font-size:14px;padding:10px;display:inline-block;"
                                                target="_blank">
                                            يمكنك أيضًا نسخ ولصق عنوان URL أدناه:
                                            <br /> <br />
                                            <strong>${buttonLink}</strong>
                                            </p>`
                                            : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.75); line-height:18px; margin:0 0 0;">
                              &copy; <strong>${
                                APP_URL?.split('//')[1]
                              }</strong> ${new Date().getFullYear()}. جميع الحقوق محفوظة.
                              ${
                                buttonLink &&
                                (buttonLink.includes('reset-password') ||
                                  buttonLink.includes('activate'))
                                  ? `<br><small>ملاحظة: هذا الرابط سيتنهي خلال ساعة واحدة</small>`
                                  : ''
                              }
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`
}

export default email
