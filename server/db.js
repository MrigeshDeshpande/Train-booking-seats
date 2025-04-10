import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'train_booking',
  password: 'mrigesh',
  port: 5432,
})

export default {
  query: (text, params) => pool.query(text, params),
}
