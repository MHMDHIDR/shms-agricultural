import mysql from 'mysql2/promise'

const { MYSQL_HOST, MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD } = process.env
const CONNECTION_OPTIONS = {
  host: MYSQL_HOST,
  database: MYSQL_NAME,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  connectionLimit: 10
}

let connectionPool: mysql.Pool | null = null

async function getConnectionPool() {
  if (!connectionPool) {
    connectionPool = await mysql.createPool(CONNECTION_OPTIONS)
    console.log('✅ Connected to MySQL')
  }
  return connectionPool
}

export async function connectDB(query: string, data: any[] | undefined = []) {
  try {
    const pool = await getConnectionPool()
    const connection = await pool.getConnection()

    const [rows] = data.length
      ? await connection.execute(query, data)
      : await connection.execute(query)

    connection.release()
    return rows
  } catch (error: any) {
    throw new Error('Error connecting to database => ' + error.message)
  }
}
