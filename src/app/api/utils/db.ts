import mysql from 'mysql2/promise'

const { MYSQL_HOST, MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD, MYSQL_URL } = process.env
const CONNECTION_OPTIONS = {
  host: MYSQL_HOST,
  database: MYSQL_NAME,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  connectionLimit: 10
}

export async function connectDB(query: string, data: any[] | undefined = []) {
  try {
    const connection = await mysql.createConnection(MYSQL_URL! ?? CONNECTION_OPTIONS)
    console.log('✅ Connected to MySQL')

    const [rows] = data.length
      ? await connection.execute(query, data)
      : await connection.execute(query)

    connection.end()
    return rows
  } catch (error: any) {
    throw new Error('Error connecting to database => ' + error.message)
  }
}
