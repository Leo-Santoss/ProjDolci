import { useState } from "react";

// Este hook agora gerencia todas as operações relacionadas a doces na API
export default function DocesServices() {
    const [loading, setLoading] = useState(false);
    const url = 'http://localhost:3333';

    // FUNÇÃO PARA LISTAR TODOS OS DOCES
    const listar = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/produtos`);
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
    const cadastrar = (formData, imagemFile) => {
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imagemFile) {
            data.append('imagem', imagemFile);
        }

        return fetch(`${url}/produtos`, {
            method: 'POST',
            body: data,
        })
        .then(response => response.json().then(res => {
            if (!response.ok) throw new Error(res.message);
            return res;
        }))
        .finally(() => setLoading(false));
    };

    // FUNÇÃO PARA EDITAR UM DOCE EXISTENTE
    const editar = (id, formData, imagemFile) => {
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imagemFile) {
            data.append('imagem', imagemFile);
        }

        return fetch(`${url}/produtos/${id}`, {
            method: 'PUT', // Método PUT para atualização
            body: data,
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(res => { throw new Error(res.message) });
            }
            // PUT com sucesso geralmente retorna 204 No Content, que não tem corpo
            return { success: true, message: 'Atualizado com sucesso!' };
        })
        .finally(() => setLoading(false));
    };
    
    // FUNÇÃO PARA EXCLUIR UM DOCE
    const excluir = (id) => {
        setLoading(true);
        return fetch(`${url}/produtos/${id}`, {
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


    return {
        loading,
        listar,
        cadastrar,
        editar,
        excluir,
    };
}