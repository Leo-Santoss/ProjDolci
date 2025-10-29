import { sql } from '../db.js'

// Criação da tabela principal
// Este arquivo é rodado somente uma vez para a criação da tabela com:
// node create_table.js
// Só está aqui para a consulta da sua estrutura.


// sql`
// CREATE TABLE pedidos (
//     id SERIAL PRIMARY KEY,
//     id_usuario INT NOT NULL,
//     total NUMERIC(10, 2) NOT NULL,
//     status VARCHAR(50) NOT NULL DEFAULT 'Pendente', -- Ex: Pendente, Processando, Enviado, Entregue, Cancelado
//     endereco_entrega TEXT NOT NULL,
//     pedido_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

//     FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
// );`.then(() =>{

//     console.log('tabela criada')
// })


sql`
CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL, -- "Congela" o preço do produto no momento da compra

    FOREIGN KEY (id_pedido) REFERENCES pedidos(id) ON DELETE CASCADE, -- Se o pedido for deletado, seus itens também são.
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);`.then(() =>{

    console.log('tabela criada')
})

// tipo_acesso ou é 0 (quando é um usuário comum, ou é 1 que é colaborador)