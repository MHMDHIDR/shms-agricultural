//withdrawActions/get/[userId]/route.ts
import { connectDB } from '@/api/utils/db'

export const revalidate = 0
export async function GET() {
  // Construct the SQL query with a JOIN statement to retrieve user details from the users table
  const query = `
    SELECT
      wa.shms_withdraw_id,
      wa.shms_created_at,
      wa.shms_user_id,
      wa.shms_withdraw_amount,
      wa.shms_action_type,
      wa.accounting_operation_status,
      u.shms_fullname,
      u.shms_phone,
      u.shms_email,
      u.shms_address
    FROM
      withdraw_actions wa
    INNER JOIN
      users u ON wa.shms_user_id = u.shms_id
  `

  try {
    // Execute the SQL query
    const withdraw_actions = await connectDB(query)

    // Return the response with the retrieved data
    return new Response(JSON.stringify(withdraw_actions))
  } catch (error) {
    // Handle any errors that occur during database query execution
    console.error('Error fetching withdraw actions:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
