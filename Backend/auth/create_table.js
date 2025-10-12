import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.


sql`
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_acesso INTEGER NOT NULL 
);`.then(() =>{

    console.log('tabela criada')
})


// tipo_acesso ou é 0 (quando é um usuário comum, ou é 1 que é colaborador)