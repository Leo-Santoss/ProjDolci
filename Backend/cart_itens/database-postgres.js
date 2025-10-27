// Em /src/database-postgres-carrinho-itens.js
import { sql } from '../db.js';

export class DatabasePostgresCarrinhoItens {

    // Lista todos os itens de um carrinho específico, juntando com os dados do produto
    async listByCartId(id_carrinho) {
        const itens = await sql`
            SELECT 
                ci.id, 
                ci.quantidade,
                p.id as produto_id,
                p.nome,
                p.preco,
                p.imagem
            FROM carrinho_itens ci
            JOIN produtos p ON ci.id_produto = p.id
            WHERE ci.id_carrinho = ${id_carrinho}
        `;
        return itens;
    }

    // Adiciona um novo item ao carrinho ou atualiza a quantidade se já existir
    async addOrUpdate(itemData) {
        const { id_carrinho, id_produto, quantidade, preco_unitario } = itemData;

        // Verifica se o item já existe no carrinho
        const [existingItem] = await sql`
            SELECT id, quantidade FROM carrinho_itens 
            WHERE id_carrinho = ${id_carrinho} AND id_produto = ${id_produto}
        `;

        if (existingItem) {
            // Se existe, atualiza a quantidade
            const novaQuantidade = existingItem.quantidade + quantidade;
            await sql`
                UPDATE carrinho_itens 
                SET quantidade = ${novaQuantidade} 
                WHERE id = ${existingItem.id}
            `;
        } else {
            // Se não existe, insere um novo
            await sql`
                INSERT INTO carrinho_itens (id_carrinho, id_produto, quantidade, preco_unitario) 
                VALUES (${id_carrinho}, ${id_produto}, ${quantidade}, ${preco_unitario})
            `;
        }
    }

    // Atualiza a quantidade de um item específico
    async updateQuantity(id_item, quantidade) {
        await sql`
            UPDATE carrinho_itens SET quantidade = ${quantidade} WHERE id = ${id_item}
        `;
    }

    // Remove um item do carrinho
    async delete(id_item) {
        await sql`DELETE FROM carrinho_itens WHERE id = ${id_item}`;
    }
}