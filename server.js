// import { createServer } from 'node:http'

// const server = createServer((request, response) =>{
//     response.write('hello world')

//     return response.end()
// })

// server.listen(3333)

import {fastify} from 'fastify'

import { DatabasePostgres } from './database-postgres.js'

import { send } from 'process'

const server = fastify()

// const database = new DatabaseMemory()

const database = new DatabasePostgres()

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

server.listen({
    port: 3333,
})