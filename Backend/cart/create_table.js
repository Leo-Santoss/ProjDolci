import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.

sql`
CREATE TABLE carrinhos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NULL, -- Pode ser nulo para usuários não logados
    id_sessao VARCHAR(255) NULL, -- Para identificar carrinhos de visitantes
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) -- Assumindo que você tem uma tabela de usuários
);`.then(() =>{

    console.log('tabela criada')
})