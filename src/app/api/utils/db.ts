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

function getConnectionPool() {
  if (!connectionPool) {
    connectionPool = mysql.createPool(CONNECTION_OPTIONS)
    console.log('✅ Connected to MySQL')
  }
  return connectionPool
}

function formatDateForMySQL(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export async function connectDB(query: string, data: any[] | undefined = []) {
  try {
    const pool = getConnectionPool()
    const connection = await pool.getConnection()

    const formattedData = data.map(item =>
      item instanceof Date ? formatDateForMySQL(item) : item
    )

    const [rows] = formattedData.length
      ? await connection.execute(query, formattedData)
      : await connection.execute(query)

    connection.release()
    return rows
  } catch (error: any) {
    throw new Error('Error connecting to database => ' + error.message)
  }
}
