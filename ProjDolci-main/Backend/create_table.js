import { sql } from './db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.

sql`
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    ingredientes TEXT NULL,
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    tipo_de_medida TEXT NULL
);`.then(() =>{

    console.log('tabela criada')
})