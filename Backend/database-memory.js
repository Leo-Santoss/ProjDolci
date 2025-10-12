import { randomUUID } from "crypto"

export class DatabaseMemory {
    #produtos = new Map()

    list(search) {
       return Array.from(this.#produtos.entries())
       .map((produtosArray) => {
        const id = produtosArray[0]
        const data = produtosArray[1]
        
        return {
            id,
            ...data,
        }

       })
       .filter(produto => {
            if(search){
                return produto.nome.includes(search)
            }

            // true para retornar o vídeo com essa busca, false para tirar esses registros filtrados
            return true
       })
    }

    create(produto){
        const produtoId = randomUUID()

        this.#produtos.set(produtoId, produto)
    }
    
    update(id, produto){
        this.#produtos.set(id, produto)
    }

    delete(id){
        this.#produtos.delete(id)
    }
}