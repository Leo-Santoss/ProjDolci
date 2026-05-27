import { useState } from "react";

export default function ReceitasServices() {
    const [loading, setLoading] = useState(false);
    const url = 'https://dolciapi.onrender.com/api';

    // Busca a receita de um produto específico

    const getByProdutoId = async (id_produto) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/receitas/produto/${id_produto}`);

            // 1. CASO DE SUCESSO: Se a resposta for OK (status 200), a receita foi encontrada.
            if (response.ok) {
                return await response.json(); 
            }

            // 2. CASO ESPERADO: Se a resposta for 404, a receita não existe.
            if (response.status === 404) {
                return null; // Retornamos 'null' para indicar ao componente que o formulário deve vir em branco.
            }
            
            // 3. CASO DE ERRO REAL: Se for qualquer outro erro (como 500), aí sim lançamos uma exceção.
            throw new Error('Falha inesperada ao buscar a receita no servidor.');

        } finally {
            setLoading(false);
        }
    };

    // Função inteligente para CRIAR ou ATUALIZAR
    const salvar = (receitaData) => {
        setLoading(true);
        
        const isUpdating = !!receitaData.id;
        const endpoint = isUpdating ? `${url}/receitas/${receitaData.id}` : `${url}/receitas`;
        const method = isUpdating ? 'PUT' : 'POST';

        return fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(receitaData),
        })
        .then(response => {
            if (!response.ok && response.status !== 204) { // 204 é uma resposta OK para PUT
                return response.json().then(res => { throw new Error(res.message || 'Erro') });
            }
            return { success: true, message: 'Receita salva com sucesso!' };
        })
        .finally(() => setLoading(false));
    };


    return {
        loading,
        getByProdutoId,
        salvar,
    };
}