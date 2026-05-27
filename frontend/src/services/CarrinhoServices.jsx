import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Instale com: npm install uuid

// Função auxiliar para gerenciar identificadores
const getIdentifiers = () => {
    // A nova API usa a chave 'auth' com { user, token } (definido em auth.jsx)
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const token = authData.token || localStorage.getItem('authToken');
    const usuarioId = authData.user?.id || 'null';

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId && !token) {
        sessionId = uuidv4();
        localStorage.setItem('sessionId', sessionId);
    }
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    return { headers, usuarioId };
};

export default function CarrinhoServices() {
    const [loading, setLoading] = useState(false);
    const url = 'https://dolciapi.onrender.com/api';

    // Pega o carrinho atual e seus itens de uma vez (a nova API já mescla isso na mesma rota)
    const getItensDoCarrinho = async () => {
        setLoading(true);
        try {
            const { headers, usuarioId } = getIdentifiers();
            const carrinhoResponse = await fetch(`${url}/carrinhos/usuario/${usuarioId}`, { headers });
            
            if (!carrinhoResponse.ok) {
                throw new Error("Não foi possível obter o carrinho.");
            }
            const carrinho = await carrinhoResponse.json();
            return carrinho.itens || [];

        } catch (error) {
            console.error("Erro no serviço de carrinho:", error);
            return []; // Retorna um array vazio em caso de erro
        } finally {
            setLoading(false);
        }
    };

    // Atualiza a quantidade de um item (a rota da nova API é PUT /itens/:itemId)
    const atualizarQuantidadeItem = async (itemId, novaQuantidade) => {
        const { headers } = getIdentifiers();
        return fetch(`${url}/carrinhos/itens/${itemId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ quantidade: novaQuantidade })
        });
    };
    
    // Remove um item do carrinho (a rota da nova API é DELETE /itens/:itemId)
    const removerItem = async (itemId) => {
        const { headers } = getIdentifiers();
        delete headers['Content-Type'];

        return fetch(`${url}/carrinhos/itens/${itemId}`, {
            method: 'DELETE',
            headers
        });
    };

    // Adiciona um item ao carrinho
    const adicionarItem = async ({ id_produto, quantidade, preco_unitario }) => {
        const { headers, usuarioId } = getIdentifiers();
        
        // A nova API já se vira para criar o carrinho caso não exista, basta chamar a rota de adicionar item:
        const response = await fetch(`${url}/carrinhos/usuario/${usuarioId}/itens`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                doce_id: id_produto,
                quantidade,
                preco_unitario
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || "Não foi possível adicionar o item ao carrinho.");
        }

        return await response.json();
    };

    return {
        loading,
        getItensDoCarrinho,
        atualizarQuantidadeItem,
        adicionarItem,
        removerItem
    };
}