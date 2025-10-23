import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import { DatabasePostgresAuth } from './auth/database-postgres.js'
import fastifyCors from '@fastify/cors'
// import { send } from 'process' // send não é usado, pode remover
import 'dotenv/config'
import jwt from 'jsonwebtoken'

// --- NOVAS IMPORTAÇÕES ---
import fastifyMultipart from '@fastify/multipart'
import { pipeline } from 'stream'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

// Transforma a pipeline baseada em callback para uma baseada em Promise (para usar com async/await)
const pump = promisify(pipeline)

const server = fastify()
const database = new DatabasePostgres()
const databaseAuth = new DatabasePostgresAuth()

// --- REGISTRO DOS PLUGINS ---
server.register(fastifyCors, { 
    origin: true 
});

// NOVO: Registrar o plugin multipart
server.register(fastifyMultipart);


// ==========================================================
// ROTA DE PRODUTOS MODIFICADA
// ==========================================================
server.post('/produtos', async (request, reply) => {
    // A rota agora vai lidar com multipart, não com um body JSON simples.
    const parts = request.parts()
    const body = {}
    let fileName = null;

    try {
        for await (const part of parts) {
            if (part.file) {
                // É um arquivo
                // 1. Gerar um nome de arquivo único para evitar conflitos
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                fileName = part.fieldname + '-' + uniqueSuffix + path.extname(part.filename);

                // 2. Definir o caminho para salvar o arquivo
                // Crie uma pasta 'public/uploads' na raiz do seu projeto backend
                const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

                // 3. Salvar o arquivo no disco
                await pump(part.file, fs.createWriteStream(filePath));
                
                // Adiciona o nome do arquivo ao nosso objeto body
                body.imagem = fileName;

            } else {
                // É um campo de texto normal (nome, preco, etc.)
                body[part.fieldname] = part.value
            }
        }
    } catch (error) {
        console.error('Erro ao processar o upload:', error);
        return reply.status(500).send({ message: "Erro ao fazer upload do arquivo." });
    }

    // Agora 'body' contém todos os campos de texto e o nome da imagem salva.
    const { nome, descricao, ingredientes, preco, tipo_de_medida, imagem } = body;

    // A chamada ao banco de dados permanece a mesma!
    await database.create({
        nome,
        descricao,
        ingredientes,
        preco,
        tipo_de_medida,
        imagem // Aqui passamos o nome do arquivo que foi salvo no servidor
    });

    return reply.status(201).send({ success: true, message: "Produto cadastrado!" });
});


// As outras rotas de produtos permanecem iguais
server.get('/produtos' , async (request, reply) => {
    const search = request.query.search
    const produtos = await database.list(search)
    return produtos 
})

server.put('/produtos/:id' , async (request, reply) => {
    // NOTA: Esta rota de update precisaria de uma lógica similar à de POST
    // se você quisesse permitir a atualização da imagem. Por enquanto, ela
    // só atualiza os campos de texto.
    const produtoId = request.params.id
    const {nome, descricao, ingredientes, preco, tipo_de_medida, imagem} = request.body

    await database.update(produtoId, {
        nome, descricao, ingredientes, preco, tipo_de_medida, imagem
    })

    return reply.status(204).send()
})

server.delete('/produtos/:id' , async (request, reply) => {
    const produtoId = request.params.id
    await database.delete(produtoId)
    return reply.status(204).send()
})


// ... (código de autenticação e usuários) ...
server.post('/auth/user/register' , async (request, reply) => {
    const {nome, email, senha} = request.body
    await databaseAuth.register({nome, email, senha})
    return reply.status(201).send()
})

server.post('/auth/user/login' , async (request, reply) => {
    try {
        const {email, senha} = request.body
        const userLoggedArray = await databaseAuth.login({email,senha})
        if (userLoggedArray && userLoggedArray.length > 0) {
            const user = userLoggedArray[0];
            const payload = {
                userId: user.id,
                nome: user.nome,
                email: user.email,
                tipo_acesso: user.tipo_acesso
            };
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
            return reply.status(200).send({
                success: true,
                message: "Usuário logado com sucesso!",
                token: token,
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

server.get('/auth/user' , async (request, reply) => {
    const search = request.query.search
    const usuarios = await databaseAuth.list(search)
    return usuarios 
})

server.put('/auth/user/:id' , async (request, reply) => {
    const usuarioId = request.params.id
    const {nome, email, senha, tipo_acesso} = request.body
    await databaseAuth.update(usuarioId, {nome, email, senha, tipo_acesso,})
    return reply.status(204).send()
})

server.delete('/auth/user/:id' , async (request, reply) => {
    const usuarioId = request.params.id
    await databaseAuth.delete(usuarioId)
    return reply.status(204).send()
})


server.listen({
    host: '0.0.0.0', // Adicione para escutar em todas as interfaces de rede
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running on port 3333');
});