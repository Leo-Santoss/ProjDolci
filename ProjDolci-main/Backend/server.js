
import {fastify} from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import { DatabasePostgresAuth } from './auth/database-postgres.js'
import fastifyCors from '@fastify/cors';
import { send } from 'process'
import 'dotenv/config';
import jwt from 'jsonwebtoken';

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
    try {
        const {email, senha} = request.body

        const userLoggedArray = await databaseAuth.login({
            email,
            senha
        })

        if (userLoggedArray && userLoggedArray.length > 0) {
            const user = userLoggedArray[0];

            // 2. Criar o "payload" do token com dados do usuário
            const payload = {
                userId: user.id,
                nome: user.nome,
                email: user.email,
                tipo_acesso: user.tipo_acesso
            };

            // 3. Gerar o token JWT
            const token = jwt.sign(
                payload,              // Dados que estarão dentro do token
                process.env.JWT_SECRET, // Sua chave secreta
                { expiresIn: '1h' }     // Opções (ex: token expira em 1 hora)
            );

            // 4. Enviar o token na resposta
            return reply.status(200).send({
                success: true,
                message: "Usuário logado com sucesso!",
                token: token, // Envia o token para o cliente
                user: payload
            });

        } else {
            return reply.status(401).send({
                success: false,
                message: "Email ou senha inválidos."
            });
        }
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
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