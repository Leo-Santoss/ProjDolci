import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.

sql`
CREATE TABLE receitas (
    id SERIAL PRIMARY KEY,
    id_produto INT NOT NULL UNIQUE, -- Garante que cada produto tenha apenas uma receita
    ingredientes TEXT NOT NULL,
    modo_de_preparo TEXT NOT NULL,
    tempo_preparo_minutos INT NULL, -- Tempo estimado em minutos
    rendimento VARCHAR(255) NULL, -- Ex: '10 porções', '1 bolo de 2kg'
    imagem_passo1 VARCHAR(255) NULL, -- Nome do arquivo de imagem (ex: 'bolo-massa.jpg')
    imagem_passo2 VARCHAR(255) NULL,
    imagem_passo3 VARCHAR(255) NULL,
    FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
);`.then(() =>{
    console.log('tabela criada')
})