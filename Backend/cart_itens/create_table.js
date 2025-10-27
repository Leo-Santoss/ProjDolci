import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.

sql`
CREATE TABLE carrinho_itens (
    id SERIAL PRIMARY KEY,
    id_carrinho INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario NUMERIC(10, 2) NOT NULL, -- Preço no momento da adição
    adicionado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_carrinho) REFERENCES carrinhos(id) ON DELETE CASCADE, -- Se o carrinho for deletado, os itens somem
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);`.then(() =>{

    console.log('tabela criada')
})