
import {fastify} from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import { DatabasePostgresAuth } from './auth/database-postgres.js'
import fastifyCors from '@fastify/cors';
import { send } from 'process'

const server = fastify()
const database = new DatabasePostgres()
const databaseAuth = new DatabasePostgresAuth()


// 1. Registrar o plugin
server.register(fastifyCors, { 
    origin: true 
});


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

server.post('/auth/user/register' , async (request, reply) => {
    const {nome, email, senha} = request.body

    await databaseAuth.register({
        nome,
        email,
        senha,
    })

    return reply.status(201).send()
})

server.post('/auth/user/login' , async (request, reply) => {
    const {email, senha} = request.body

    const userLogged = await databaseAuth.login({
        email,
        senha
    })

    return reply.status(200).send(userLogged)
})


// Users control

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