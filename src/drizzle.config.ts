import type { Config } from 'drizzle-kit'

const { MYSQL_HOST, MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD } = process.env

const config: Config = {
  schema: './database/db_tables.ts',
  out: './database/drizzle',
  dialect: 'mysql',
  dbCredentials: {
    user: MYSQL_USER!,
    password: MYSQL_PASSWORD!,
    host: MYSQL_HOST!,
    port: 3306,
    database: MYSQL_NAME!
  }
}

export default config
