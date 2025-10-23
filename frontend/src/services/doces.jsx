// VERSÃO CORRETA
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DocesServices(){
    const [cadastroDocesLoading, setCadastroDocesLoading] = useState(false)
    const navigate = useNavigate()
    const url = 'http://localhost:3333/produtos'

    const cadastrar = (formDataFromComponent) => {
        setCadastroDocesLoading(true)
        
        const data = new FormData();

        // Adiciona todos os campos ao FormData
        data.append('nome', formDataFromComponent.nome);
        data.append('descricao', formDataFromComponent.descricao);
        data.append('ingredientes', formDataFromComponent.ingredientes);
        data.append('preco', formDataFromComponent.preco);
        data.append('tipo_de_medida', formDataFromComponent.tipo_de_medida);
        
        if (formDataFromComponent.imagem) {
            data.append('imagem', formDataFromComponent.imagem);
        }

        // --- CORREÇÃO PRINCIPAL AQUI ---
        fetch(url, {
            method: 'POST',
            // REMOVA COMPLETAMENTE O OBJETO 'headers'
            // O NAVEGADOR VAI ADICIONAR O 'Content-Type: multipart/form-data' SOZINHO
            body: data // Envie o objeto FormData diretamente, SEM JSON.stringify
        })
        .then(response => {
            // É uma boa prática verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                // Isso vai nos dar mais detalhes no console se algo der errado
                return response.json().then(err => { throw err });
            }
            return response.json();
        })
        .then((result) => {
            console.log(result);
            // Assumindo que seu backend retorna { success: true }
            if(result.success){
                navigate('/doces');
            }
        })
        .catch((error) => {
            // O erro que você viu aparecerá aqui agora
            console.error("Erro detalhado do servidor:", error);
        })
        .finally(() => {
            setCadastroDocesLoading(false);
        });
    }

    // ... o resto do seu código ...
    
    return{
        cadastrar,
        // editar, // Lembre-se que editar também precisará ser ajustado se for alterar a imagem
        cadastroDocesLoading
    }
}

