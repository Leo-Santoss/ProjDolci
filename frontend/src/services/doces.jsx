import { useState } from "react";

export default function DocesServices() {
    const [loading, setLoading] = useState(false);
    const url = 'https://dolciapi.onrender.com/api';

    // FUNÇÃO PARA LISTAR TODOS OS DOCES
    const listar = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/doces`);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados.');
            }
            const data = await response.json();
            return data;
        } finally {
            setLoading(false);
        }
    };

    // FUNÇÃO PARA CADASTRAR UM NOVO DOCE
    const cadastrar = (formData) => {
        setLoading(true);

        return fetch(`${url}/doces`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(response => response.json().then(res => {
            if (!response.ok) throw new Error(res.message || 'Erro');
            return res;
        }))
        .finally(() => setLoading(false));
    };

    // FUNÇÃO PARA EDITAR UM DOCE EXISTENTE
    const editar = (id, formData) => {
        setLoading(true);

        return fetch(`${url}/doces/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(res => { throw new Error(res.message || 'Erro') });
            }
            // PUT com sucesso geralmente retorna 204 No Content, que não tem corpo
            return { success: true, message: 'Atualizado com sucesso!' };
        })
        .finally(() => setLoading(false));
    };
    
    // FUNÇÃO PARA EXCLUIR UM DOCE
    const excluir = (id) => {
        setLoading(true);
        return fetch(`${url}/doces/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
             if (!response.ok) {
                return response.json().then(res => { throw new Error(res.message) });
            }
            return { success: true, message: 'Excluído com sucesso!' };
        })
        .finally(() => setLoading(false));
    }

    const listarComReceitas = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/doces`);
            if (!response.ok) {
                throw new Error('Falha ao buscar produtos com receitas.');
            }
            return await response.json();
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        listar,
        cadastrar,
        editar,
        excluir,
        listarComReceitas,
    };
}