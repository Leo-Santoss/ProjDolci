import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Instale com: npm install uuid

// Função auxiliar para gerenciar identificadores
const getIdentifiers = () => {
    const token = localStorage.getItem('authToken'); // Assumindo que você salva o token aqui
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
    return { headers };
};


export default function CarrinhoServices() {
    const [loading, setLoading] = useState(false);
    const url = 'http://localhost:3333';

    // Pega o carrinho atual (cria se não existir) e depois busca seus itens
    const getItensDoCarrinho = async () => {
        setLoading(true);
        try {
            // 1. Pega as informações do carrinho principal
            const { headers } = getIdentifiers();
            const carrinhoResponse = await fetch(`${url}/carrinho`, { headers });
            if (!carrinhoResponse.ok) {
                throw new Error("Não foi possível obter o carrinho.");
            }
            const carrinho = await carrinhoResponse.json();

            // 2. Se o carrinho existir, busca os itens dele
            if (carrinho && carrinho.id) {
                const itensResponse = await fetch(`${url}/carrinho/${carrinho.id}/itens`, { headers });
                if (!itensResponse.ok) {
                    throw new Error("Não foi possível buscar os itens do carrinho.");
                }
                const itens = await itensResponse.json();
                return itens;
            }
            return []; // Retorna vazio se não houver carrinho

        } catch (error) {
            console.error("Erro no serviço de carrinho:", error);
            return []; // Retorna um array vazio em caso de erro
        } finally {
            setLoading(false);
        }
    };

    // Atualiza a quantidade de um item
    const atualizarQuantidadeItem = async (itemId, novaQuantidade) => {
        const { headers } = getIdentifiers();
        return fetch(`${url}/carrinho/itens/${itemId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ quantidade: novaQuantidade })
        });
    };
    
    // Remove um item do carrinho
    const removerItem = async (itemId) => {
        const { headers } = getIdentifiers();

        delete headers['Content-Type'];

        return fetch(`${url}/carrinho/itens/${itemId}`, {
            method: 'DELETE',
            headers
        });
    };

    const adicionarItem = async ({ id_produto, quantidade, preco_unitario }) => {
    // 1. Pega as informações do carrinho principal (cria se não existir)
    const { headers } = getIdentifiers();
    const carrinhoResponse = await fetch('http://localhost:3333/carrinho', { headers });
    if (!carrinhoResponse.ok) {
        throw new Error("Não foi possível obter o carrinho para adicionar o item.");
    }
    const carrinho = await carrinhoResponse.json();

    // 2. Adiciona o item ao carrinho obtido
    const response = await fetch('http://localhost:3333/carrinho/itens', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            id_carrinho: carrinho.id,
            id_produto,
            quantidade,
            preco_unitario
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Não foi possível adicionar o item ao carrinho.");
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