import client from '@/../prisma/prismadb'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const role = searchParams.get('role')
  const userId = searchParams.get('userId')

  let users = []

  if (role === 'investor') {
    users = await client.users.findMany({
      where: {
        NOT: { shms_user_stocks: { isEmpty: true } },
        shms_user_is_deleted: false
      }
    })
  } else if (userId) {
    users = await client.users.findMany({
      where: {
        id: userId,
        shms_user_is_deleted: false
      }
    })
  } else {
    users = await client.users.findMany({
      where: {
        shms_user_is_deleted: false
      }
    })
  }

  // Reorder properties to match the schema
  const orderedUsers = users.map(user => ({
    id: user.id,
    shms_sn: user.shms_sn,
    shms_fullname: user.shms_fullname,
    shms_nationality: user.shms_nationality,
    shms_date_of_birth: user.shms_date_of_birth,
    shms_address: user.shms_address,
    shms_email: user.shms_email,
    shms_password: user.shms_password,
    shms_phone: user.shms_phone,
    shms_doc: user.shms_doc,
    shms_user_stocks: user.shms_user_stocks,
    shms_user_stock_limit: user.shms_user_stock_limit,
    shms_user_credits: user.shms_user_credits,
    shms_created_at: user.shms_created_at,
    shms_user_account_type: user.shms_user_account_type,
    shms_user_account_status: user.shms_user_account_status,
    shms_user_reset_token: user.shms_user_reset_token,
    shms_user_reset_token_expires: user.shms_user_reset_token_expires,
    shms_user_is_deleted: user.shms_user_is_deleted,
    message: user.message,
    loggedIn: user.loggedIn,
    userAdded: user.userAdded,
    userUpdated: user.userUpdated,
    userActivated: user.userActivated,
    userWithdrawnBalance: user.userWithdrawnBalance,
    forgotPassSent: user.forgotPassSent,
    newPassSet: user.newPassSet,
    resetEmail: user.resetEmail,
    userDeleted: user.userDeleted
  }))

  return new Response(JSON.stringify(orderedUsers), {
    headers: { 'Content-Type': 'application/json' }
  })
}
