import { useState } from "react";

export default function ReceitasServices() {
    const [loading, setLoading] = useState(false);
    const url = 'http://localhost:3333';

    // Busca a receita de um produto específico
    
    const getByProdutoId = async (id_produto) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/receitas/produto/${id_produto}`);

            // 1. PRIMEIRO, checamos o caso de SUCESSO (status 200)
            if (response.ok) {
                return await response.json(); // Se encontrou, retorna a receita
            }

            // 2. DEPOIS, checamos o caso ESPERADO de "não encontrado"
            if (response.status === 404) {
                return null; // Se não encontrou, retorna null para o formulário ficar em branco
            }
            
            // 3. SE NÃO FOR NENHUM DOS ANTERIORES, aí sim é um erro inesperado
            throw new Error('Falha ao buscar a receita no servidor.');

        } finally {
            setLoading(false);
        }
    };

    // Função inteligente para CRIAR ou ATUALIZAR
    const salvar = (receitaData, files) => {
        setLoading(true);
        
        const data = new FormData();
        // Adiciona campos de texto
        Object.keys(receitaData).forEach(key => {
            // Não adiciona os campos de imagem que estão no formData
            if (!key.startsWith('imagem_passo')) {
                data.append(key, receitaData[key]);
            }
        });
        
        // Adiciona os arquivos de imagem
        Object.keys(files).forEach(key => {
            if (files[key]) { // Apenas se um arquivo foi selecionado
                data.append(key, files[key]);
            }
        });

        const isUpdating = !!receitaData.id;
        const endpoint = isUpdating ? `${url}/receitas/${receitaData.id}` : `${url}/receitas`;
        const method = isUpdating ? 'PUT' : 'POST';

        return fetch(endpoint, {
            method: method,
            body: data,
        })
        .then(response => {
            if (!response.ok && response.status !== 204) { // 204 é uma resposta OK para PUT
                return response.json().then(res => { throw new Error(res.message) });
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