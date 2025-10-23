import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.

sql`
CREATE TABLE tipos_sabores (
    id SERIAL PRIMARY KEY,
    id_produto INT NOT NULL,
    nome_sabor VARCHAR(255) NOT NULL,
    valor_acrescido NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (valor_acrescido >= 0),
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
);`.then(() =>{

    console.log('tabela criada')
})