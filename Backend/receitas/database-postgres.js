import { sql } from '../db.js'

export class DatabasePostgresReceitas {

    async selectByProdutoId(id_produto) {
        try {
            const resultado = await sql`
                select id, id_produto, ingredientes, modo_de_preparo, tempo_preparo_minutos, rendimento, imagem_passo1, imagem_passo2, imagem_passo3 
                from receitas 
                where id_produto = ${id_produto} 
                limit 1
            `;
            
            // Se 'resultado' for um array (mesmo que vazio), retorna o primeiro item ou undefined.
            // Isso é seguro e não causa erros.
            return resultado ? resultado[0] : undefined;

        } catch (error) {
            // Se a query falhar por qualquer motivo (conexão, sintaxe, etc.)
            console.error("ERRO NO BANCO DE DADOS ao buscar receita por id_produto:", error);
            
            // Lança o erro novamente para que a rota no server.js possa tratá-lo,
            // mas agora com um log claro do que aconteceu.
            throw new Error("Falha ao consultar o banco de dados.");
        }
    }

    // A sua função select original (pode ser útil no futuro)
    async select(id) {
        let receita;
        if (id) {
            receita = await sql`select id, id_produto, ingredientes, modo_de_preparo, tempo_preparo_minutos, rendimento, imagem_passo1, imagem_passo2, imagem_passo3 from receitas where id = ${id}`;
        }
        return receita;
    }

    async create(receita) {
        const { id_produto, ingredientes, modo_de_preparo, tempo_preparo_minutos, rendimento, imagem_passo1, imagem_passo2, imagem_passo3 } = receita;
        await sql`INSERT INTO receitas (id_produto, ingredientes, modo_de_preparo, tempo_preparo_minutos, rendimento, imagem_passo1, imagem_passo2, imagem_passo3) VALUES (${id_produto}, ${ingredientes}, ${modo_de_preparo}, ${tempo_preparo_minutos}, ${rendimento}, ${imagem_passo1}, ${imagem_passo2}, ${imagem_passo3})`;
    }

    async update(id, receita) {
        const { id_produto, ingredientes, modo_de_preparo, tempo_preparo_minutos, rendimento, imagem_passo1, imagem_passo2, imagem_passo3 } = receita;
        // CORREÇÃO: Removido o ')' extra no final da query
        await sql`UPDATE receitas SET
            id_produto = ${id_produto},
            ingredientes = ${ingredientes},
            modo_de_preparo = ${modo_de_preparo},
            tempo_preparo_minutos = ${tempo_preparo_minutos},
            rendimento = ${rendimento},
            imagem_passo1 = ${imagem_passo1},
            imagem_passo2 = ${imagem_passo2},
            imagem_passo3 = ${imagem_passo3}
            WHERE id = ${id}`;
    }

    async delete(id) {
        await sql`DELETE FROM receitas WHERE id = ${id}`;
    }
}