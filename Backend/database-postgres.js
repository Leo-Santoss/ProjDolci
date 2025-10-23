// import { randomUUID } from "crypto"
import {sql} from './db.js'

export class DatabasePostgres {

    async list(search) {

        let produtos

        if(search){
            produtos = await sql`select * from produtos where nome ilike ${`%${search}%`}`
        }else{
            produtos = await sql`select * from produtos`
        }
        return produtos
    }

    async create(produto){
        const {nome, descricao, ingredientes, preco, tipo_de_medida, imagem} = produto

        await sql`INSERT INTO produtos (
        nome, descricao, ingredientes, preco, tipo_de_medida, imagem) VALUES
        (${nome}, ${descricao},${ingredientes}, ${preco}, ${tipo_de_medida}, ${imagem})`

    }
    
    async update(id, produto){
        const {nome, descricao, ingredientes, preco, tipo_de_medida, imagem} = produto
        
        await sql`UPDATE produtos SET
        nome = ${nome},
        descricao = ${descricao},
        ingredientes = ${ingredientes},
        preco = ${preco},
        tipo_de_medida = ${tipo_de_medida},
        imagem = ${imagem}
        WHERE id = ${id}`
    }

    async delete(id){
        await sql`DELETE FROM produtos WHERE id = ${id}`
    }
}