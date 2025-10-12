
import {fastify} from 'fastify'

import { DatabasePostgres } from './database-postgres.js'
import { DatabasePostgresAuth } from './auth/database-postgres.js'

import { send } from 'process'

const server = fastify()

const database = new DatabasePostgres()


const databaseAuth = new DatabasePostgresAuth()


// produtos

server.post('/produtos' , async (request, reply) => {
    const {nome, descricao, ingredientes, preco, tipo_de_medida} = request.body

    await database.create({
        nome,
        descricao,
        ingredientes,
        preco,
        tipo_de_medida,
    })

    return reply.status(201).send()
})

server.get('/produtos' , async (request, reply) => {
    const search = request.query.search

    const produtos = await database.list(search)

    return produtos 
})

server.put('/produtos/:id' , async (request, reply) => {
    const produtoId = request.params.id
    const {nome, descricao, ingredientes, preco, tipo_de_medida} = request.body

    await database.update(produtoId, {
        nome,
        descricao,
        ingredientes,
        preco,
        tipo_de_medida,
    })

    return reply.status(204).send()
})

server.delete('/produtos/:id' , async (request, reply) => {
    
    const produtoId = request.params.id
    
    await database.delete(produtoId)

    return reply.status(204).send()
})




// auth

server.post('/auth/user' , async (request, reply) => {
    const {nome, email, senha, tipo_acesso} = request.body

    await databaseAuth.create({
        nome,
        email,
        senha,
        tipo_acesso,
    })

    return reply.status(201).send()
})

server.get('/auth/user' , async (request, reply) => {
    const search = request.query.search

    const usuarios = await databaseAuth.list(search)

    return usuarios 
})

server.put('/auth/user/:id' , async (request, reply) => {
    const usuarioId = request.params.id
    const {nome, email, senha, tipo_acesso} = request.body

    await databaseAuth.update(usuarioId, {
        nome,
        email,
        senha,
        tipo_acesso,
    })

    return reply.status(204).send()
})

server.delete('/auth/user/:id' , async (request, reply) => {
    
    const usuarioId = request.params.id
    
    await databaseAuth.delete(usuarioId)

    return reply.status(204).send()
})





server.listen({
    port: 3333,
})