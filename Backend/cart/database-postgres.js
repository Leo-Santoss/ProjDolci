import { sql } from '../db.js'

export class DatabasePostgresCarrinhos {

    // ==========================================================
    // INSERT (Criação)
    // ==========================================================

    /**
     * Cria um novo carrinho para um usuário logado ou um visitante (sessão).
     * Retorna o ID do carrinho recém-criado.
     * @param {object} cartData - Contém id_usuario ou id_sessao.
     * @param {number} [cartData.id_usuario] - O ID do usuário logado.
     * @param {string} [cartData.id_sessao] - O ID da sessão do visitante.
     * @returns {Promise<string>} O ID do novo carrinho.
     */
    async create({ id_usuario = null, id_sessao = null }) {
        const [novoCarrinho] = await sql`
            INSERT INTO carrinhos (id_usuario, id_sessao) 
            VALUES (${id_usuario}, ${id_sessao}) 
            RETURNING id
        `;
        return novoCarrinho.id;
    }

    // ==========================================================
    // SELECT (Consultas)
    // ==========================================================

    /**
     * Encontra o carrinho ativo mais recente de um usuário logado.
     * @param {number} id_usuario - O ID do usuário.
     * @returns {Promise<object|undefined>} O objeto do carrinho ou undefined se não for encontrado.
     */
    async findByUserId(id_usuario) {
        const [carrinho] = await sql`
            SELECT * FROM carrinhos 
            WHERE id_usuario = ${id_usuario} 
            ORDER BY atualizado_em DESC 
            LIMIT 1
        `;
        return carrinho;
    }

    /**
     * Encontra o carrinho ativo de um visitante pela sua sessão.
     * @param {string} id_sessao - O ID da sessão.
     * @returns {Promise<object|undefined>} O objeto do carrinho ou undefined se não for encontrado.
     */
    async findBySessionId(id_sessao) {
        const [carrinho] = await sql`
            SELECT * FROM carrinhos 
            WHERE id_sessao = ${id_sessao} 
            ORDER BY atualizado_em DESC 
            LIMIT 1
        `;
        return carrinho;
    }

    /**
     * Busca um carrinho específico pelo seu ID primário.
     * @param {number} id - O ID do carrinho.
     * @returns {Promise<object|undefined>} O objeto do carrinho ou undefined.
     */
    async findById(id) {
        const [carrinho] = await sql`
            SELECT * FROM carrinhos WHERE id = ${id}
        `;
        return carrinho;
    }


    // ==========================================================
    // UPDATE (Atualizações)
    // ==========================================================

    /**
     * Associa um carrinho de visitante a um usuário quando ele faz login.
     * O id_sessao é normalmente definido como nulo após a associação.
     * @param {string} id_sessao - O ID da sessão do carrinho atual.
     * @param {number} id_usuario - O ID do usuário que acabou de logar.
     */
    async associateUserToCart(id_sessao, id_usuario) {
        await sql`
            UPDATE carrinhos 
            SET 
                id_usuario = ${id_usuario}, 
                id_sessao = NULL, -- Limpa a sessão pois agora o carrinho é do usuário
                atualizado_em = CURRENT_TIMESTAMP
            WHERE id_sessao = ${id_sessao}
        `;
    }

    /**
     * Simplesmente atualiza o timestamp 'atualizado_em' de um carrinho.
     * Útil para quando um item é adicionado/removido, para manter o carrinho "vivo".
     * @param {number} id - O ID do carrinho a ser atualizado.
     */
    async touch(id) {
        await sql`
            UPDATE carrinhos 
            SET atualizado_em = CURRENT_TIMESTAMP 
            WHERE id = ${id}
        `;
    }
}