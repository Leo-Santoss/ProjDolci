// Em /src/database-postgres-pedidos.js
import { sql } from '../db.js';

export class DatabasePostgresPedidos {

    /**
     * Cria um novo pedido a partir de um carrinho.
     * Executa uma transação para garantir a integridade dos dados.
     * @param {object} dadosPedido - Contém id_usuario, id_carrinho, total, endereco_entrega.
     * @returns {Promise<string>} O ID do novo pedido.
     */
    async createFromCart({ id_usuario, id_carrinho, total, endereco_entrega }) {
        let novoPedidoId;

        // Inicia uma transação
        await sql.begin(async sql => {
            // 1. Cria o registro na tabela 'pedidos' e obtém o ID gerado
            const [pedido] = await sql`
                INSERT INTO pedidos (id_usuario, total, endereco_entrega, status)
                VALUES (${id_usuario}, ${total}, ${endereco_entrega}, 'Pendente')
                RETURNING id
            `;
            novoPedidoId = pedido.id;

            // 2. Busca todos os itens do carrinho que será convertido em pedido
            const itensDoCarrinho = await sql`
                SELECT id_produto, quantidade, preco_unitario 
                FROM carrinho_itens WHERE id_carrinho = ${id_carrinho}
            `;

            if (itensDoCarrinho.length === 0) {
                throw new Error("Não é possível criar um pedido a partir de um carrinho vazio.");
            }

            // 3. Mapeia os itens do carrinho para o formato de inserção na 'pedido_itens'
            const itensDoPedido = itensDoCarrinho.map(item => ({
                id_pedido: novoPedidoId,
                id_produto: item.id_produto,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario
            }));

            // 4. Insere todos os itens na tabela 'pedido_itens'
            await sql`
                INSERT INTO pedido_itens ${sql(itensDoPedido, 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario')}
            `;

            // 5. Limpa a tabela 'carrinho_itens' para este carrinho, pois ele virou um pedido
            await sql`
                DELETE FROM carrinho_itens WHERE id_carrinho = ${id_carrinho}
            `;
        });

        return novoPedidoId;
    }
}