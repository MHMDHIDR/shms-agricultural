import { connectDB } from './utils/db'

export async function GET() {
  const users = await connectDB(`SELECT * FROM users`)

  // const insertUser = await connectDB(`INSERT INTO users (shms_id, shms_fullname, shms_email, shms_phone)
  //  VALUES ("${crypto.randomUUID()}",
  //  "Mohammed Abdelrahim",
  //  "mhmedabdelrahim685@gmail.com",
  //  "+971 54 796 8313"
  // )`)

  return new Response(JSON.stringify(users))
}
