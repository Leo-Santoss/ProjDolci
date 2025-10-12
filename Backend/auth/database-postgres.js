import {sql} from '../db.js'

export class DatabasePostgresAuth {

    async list(search) {

        let usuarios

        if(search){
            usuarios = await sql`select nome, email, tipo_acesso from usuarios where nome ilike ${`%${search}%`}`
        }else{
            usuarios = await sql`select nome, email, tipo_acesso from usuarios`
        }
        return usuarios
    }

    async create(usuario){
        const {nome, email, senha, tipo_acesso} = usuario

        await sql`INSERT INTO usuarios (
        nome, email, senha, tipo_acesso) VALUES
        (${nome}, ${email},${senha}, ${tipo_acesso})`

    }
    
    async update(id, usuario){
        const {nome, email, senha, tipo_acesso} = usuario
        
        await sql`UPDATE usuarios SET
        nome = ${nome},
        email = ${email},
        senha = ${senha},
        tipo_acesso = ${tipo_acesso}
        WHERE id = ${id}`
    }

    async delete(id){
        await sql`DELETE FROM usuario WHERE id = ${id}`
    }
}