// db.js
import 'dotenv/config'
import postgres from 'postgres'

// Pega a URL de conexão diretamente da variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL

// É uma boa prática verificar se a variável foi realmente encontrada
if (!connectionString) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida. Verifique seu arquivo .env')
}

// Passa a string de conexão para a biblioteca do postgres
const sql = postgres(connectionString)

// Exporta a conexão para ser usada em outros arquivos
export { sql }