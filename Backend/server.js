import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import { DatabasePostgresAuth } from './auth/database-postgres.js'
import { DatabasePostgresReceitas } from './receitas/database-postgres.js'
import { DatabasePostgresCarrinhos } from './cart/database-postgres.js';
import { DatabasePostgresCarrinhoItens } from './cart_itens/database-postgres.js';
import fastifyCors from '@fastify/cors'
// import { send } from 'process' // send não é usado, pode remover
import 'dotenv/config'
import jwt from 'jsonwebtoken'

// --- NOVAS IMPORTAÇÕES ---
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static';
import { promisify } from 'util'

import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises'; // Usaremos pipeline, que é mais moderno

// Transforma a pipeline baseada em callback para uma baseada em Promise (para usar com async/await)
const pump = promisify(pipeline)

const server = fastify()
const database = new DatabasePostgres()
const databaseAuth = new DatabasePostgresAuth()
const databaseReceitas = new DatabasePostgresReceitas();
const databaseCarrinhos = new DatabasePostgresCarrinhos();
const databaseCarrinhoItens = new DatabasePostgresCarrinhoItens();

server.register(fastifyCors, {
    origin: true, // Permite qualquer origem (ótimo para desenvolvimento)
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // A linha que resolve o problema!
});

server.register(fastifyMultipart, {
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 100000,     // Max field value size in bytes
    fields: 10,         // Max number of non-file fields
    fileSize: 10 * 1024 * 1024, // For multipart forms, the max file size in bytes (here, 10MB)
    files: 5,           // Max number of file fields
    headerPairs: 2000,  // Max number of header key=>value pairs
  }
});

server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
});

///////////////////////////////DOCES

server.post('/produtos', async (request, reply) => {
    try {
        // 1. Processa o arquivo e os campos de uma só vez
        const data = await request.file();

        // Se nenhum arquivo foi enviado, 'data' será undefined.
        if (!data) {
            return reply.status(400).send({ message: "Nenhum arquivo de imagem foi enviado." });
        }

        // 2. Extrai os campos de texto do formulário
        // Os valores agora estão em `data.fields`
        const body = {};
        for (const key in data.fields) {
            body[key] = data.fields[key].value;
        }
        const { nome, descricao, ingredientes, preco, tipo_de_medida } = body;

        // 3. Prepara o nome e o caminho para salvar a imagem
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const imagemFileName = data.fieldname + '-' + uniqueSuffix + path.extname(data.filename);
        const uploadPath = path.join(process.cwd(), 'uploads', imagemFileName);

        // 4. Salva o arquivo no disco
        // O `pump` era uma forma antiga, vamos usar `pipeline` que é nativo e mais moderno
        await pipeline(data.file, fs.createWriteStream(uploadPath));

        // 5. Salva tudo no banco de dados
        await database.create({
            nome,
            descricao,
            ingredientes,
            preco,
            tipo_de_medida,
            imagem: imagemFileName // Agora a variável terá o valor correto!
        });

        return reply.status(201).send({ success: true, message: "Produto cadastrado com imagem!" });

    } catch (error) {
        // Se qualquer parte do processo falhar, este bloco será executado
        console.error('Erro geral ao processar o produto:', error);
        return reply.status(500).send({ message: "Erro interno ao processar o formulário." });
    }
});

// As outras rotas de produtos permanecem iguais
server.get('/produtos' , async (request, reply) => {
    const search = request.query.search
    const produtos = await database.list(search)
    return produtos 
})

server.put('/produtos/:id', async (request, reply) => {
    const produtoId = request.params.id;
    const parts = await request.parts();
    const body = {};
    const files = {};

    try {
        for await (const part of parts) {
            if (part.file) {
                // Se um novo arquivo for enviado, processa e salva
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileName = part.fieldname + '-' + uniqueSuffix + path.extname(part.filename);
                const uploadPath = path.join(process.cwd(), 'uploads', fileName);
                
                await pipeline(part.file, fs.createWriteStream(uploadPath));
                files[part.fieldname] = fileName;
            } else {
                // Processa os campos de texto
                body[part.fieldname] = part.value;
            }
        }

        const produtoCompleto = { ...body, ...files };
        await database.update(produtoId, produtoCompleto);

        return reply.status(204).send(); // Resposta de sucesso para PUT

    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return reply.status(500).send({ message: "Erro ao atualizar produto." });
    }
});

server.delete('/produtos/:id' , async (request, reply) => {
    const produtoId = request.params.id
    await database.delete(produtoId)
    return reply.status(204).send()
})

////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////RECEITAS
// ROTA PRINCIPAL: Busca uma receita pelo ID do PRODUTO
server.get('/receitas/produto/:id_produto', async (request, reply) => {
    try {
        const id_produto = request.params.id_produto;
        const receita = await databaseReceitas.selectByProdutoId(id_produto);
        
        if (!receita) {
            return reply.status(404).send({ message: 'Receita não encontrada para este produto.' });
        }
        
        return receita;
    } catch (error) {
        // Captura o erro que a função do banco de dados pode ter lançado
        console.error("Erro na rota /receitas/produto/:id_produto:", error);
        return reply.status(500).send({ message: "Erro interno no servidor ao buscar receita." });
    }
});

// Rota para CRIAR uma nova receita com upload de imagens
server.post('/receitas', async (request, reply) => {
    const parts = request.parts();
    const body = {};
    const files = {};

    try {
        for await (const part of parts) {
            if (part.file) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileName = part.fieldname + '-' + uniqueSuffix + path.extname(part.filename);
                const uploadPath = path.join(process.cwd(), 'uploads', fileName);
                
                await pipeline(part.file, fs.createWriteStream(uploadPath));
                // Adiciona o nome do arquivo ao campo correspondente (ex: 'imagem_passo1')
                files[part.fieldname] = fileName;
            } else {
                body[part.fieldname] = part.value;
            }
        }

        // Combina os dados de texto com os nomes dos arquivos salvos
        const receitaCompleta = { ...body, ...files };
        await databaseReceitas.create(receitaCompleta);
        
        return reply.status(201).send({ success: true, message: "Receita cadastrada!" });

    } catch (error) {
        console.error('Erro ao processar receita:', error);
        return reply.status(500).send({ message: "Erro ao cadastrar receita." });
    }
});

// Rota para ATUALIZAR uma receita existente
server.put('/receitas/:id', async (request, reply) => {
    const receitaId = request.params.id;
    const parts = request.parts();
    const body = {};
    const files = {};

    try {
        for await (const part of parts) {
            if (part.file) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileName = part.fieldname + '-' + uniqueSuffix + path.extname(part.filename);
                const uploadPath = path.join(process.cwd(), 'uploads', fileName);
                
                await pipeline(part.file, fs.createWriteStream(uploadPath));
                files[part.fieldname] = fileName;
            } else {
                body[part.fieldname] = part.value;
            }
        }

        const receitaCompleta = { ...body, ...files };
        await databaseReceitas.update(receitaId, receitaCompleta);

        return reply.status(204).send(); // 204 No Content é a resposta padrão para PUT bem-sucedido
        
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        return reply.status(500).send({ message: "Erro ao atualizar receita." });
    }
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////autenticação e usuários
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
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////CARRINHOS
/**
 * ROTA INTELIGENTE: Pega ou Cria um Carrinho.
 * Esta é a principal rota que seu frontend irá chamar.
 * - Se o usuário estiver logado (com JWT), busca/cria um carrinho para o id_usuario.
 * - Se for um visitante, busca/cria um carrinho usando um id_sessao enviado no header.
 */
server.get('/carrinho', async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        const sessionId = request.headers['x-session-id']; // Header customizado para visitantes

        let carrinho;
        let userInfo = null;

        // Tenta decodificar o token JWT se ele existir
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                userInfo = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtError) {
                // Token inválido ou expirado, trata como visitante
                userInfo = null;
            }
        }

        if (userInfo && userInfo.userId) {
            // --- LÓGICA PARA USUÁRIO LOGADO ---
            carrinho = await databaseCarrinhos.findByUserId(userInfo.userId);
            if (!carrinho) {
                const novoCarrinhoId = await databaseCarrinhos.create({ id_usuario: userInfo.userId });
                carrinho = await databaseCarrinhos.findById(novoCarrinhoId);
            }
        } else if (sessionId) {
            // --- LÓGICA PARA VISITANTE (NÃO LOGADO) ---
            carrinho = await databaseCarrinhos.findBySessionId(sessionId);
            if (!carrinho) {
                const novoCarrinhoId = await databaseCarrinhos.create({ id_sessao: sessionId });
                carrinho = await databaseCarrinhos.findById(novoCarrinhoId);
            }
        } else {
            // Se não houver nem token nem sessão, não podemos identificar o carrinho.
            return reply.status(400).send({ message: "Identificador de usuário ou sessão não fornecido." });
        }

        // Retorna o carrinho encontrado ou o recém-criado
        return reply.status(200).send(carrinho);

    } catch (error) {
        console.error("Erro ao buscar/criar carrinho:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao processar o carrinho." });
    }
});


/**
 * ROTA DE ASSOCIAÇÃO: Conecta um carrinho de visitante a um usuário.
 * Deve ser chamada pelo frontend logo após o usuário fazer o login com sucesso.
 */
server.put('/carrinho/associar', async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({ message: "Autenticação necessária (JWT não fornecido)." });
        }
        
        const token = authHeader.split(' ')[1];
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        
        const { id_sessao } = request.body;
        if (!id_sessao) {
            return reply.status(400).send({ message: "O ID da sessão do visitante é obrigatório no corpo da requisição." });
        }

        // Verifica se o carrinho da sessão realmente existe
        const carrinhoVisitante = await databaseCarrinhos.findBySessionId(id_sessao);
        if (!carrinhoVisitante) {
            // Não há carrinho para associar, o que não é um erro.
            return reply.status(200).send({ success: true, message: "Nenhum carrinho de visitante para associar." });
        }
        
        await databaseCarrinhos.associateUserToCart(id_sessao, userInfo.userId);

        return reply.status(200).send({ success: true, message: "Carrinho associado ao usuário com sucesso." });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
             return reply.status(401).send({ message: "Token inválido." });
        }
        console.error("Erro ao associar carrinho:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao associar carrinho." });
    }
});

// ROTA PARA LISTAR OS ITENS DE UM CARRINHO
server.get('/carrinho/:id_carrinho/itens', async (request, reply) => {
    try {
        const { id_carrinho } = request.params;
        const itens = await databaseCarrinhoItens.listByCartId(id_carrinho);
        
        // Formata a resposta para o frontend
        const itensFormatados = itens.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            produto: {
                id: item.produto_id,
                nome: item.nome,
                preco: parseFloat(item.preco), // Garante que o preço é um número
                imagem: item.imagem ? `http://localhost:3333/uploads/${item.imagem}` : 'https://via.placeholder.com/100'
            }
        }));

        return reply.status(200).send(itensFormatados);
    } catch (error) {
        console.error("Erro ao listar itens do carrinho:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
});

// ROTA PARA ADICIONAR UM ITEM AO CARRINHO
server.post('/carrinho/itens', async (request, reply) => {
    try {
        const { id_carrinho, id_produto, quantidade, preco_unitario } = request.body;
        await databaseCarrinhoItens.addOrUpdate({ id_carrinho, id_produto, quantidade, preco_unitario });
        return reply.status(201).send({ success: true, message: "Item adicionado com sucesso." });
    } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
});

// ROTA PARA ATUALIZAR A QUANTIDADE DE UM ITEM
server.put('/carrinho/itens/:id_item', async (request, reply) => {
    try {
        const { id_item } = request.params;
        const { quantidade } = request.body;
        if (quantidade <= 0) {
            await databaseCarrinhoItens.delete(id_item); // Se a quantidade for 0 ou menos, remove o item
        } else {
            await databaseCarrinhoItens.updateQuantity(id_item, quantidade);
        }
        return reply.status(200).send({ success: true, message: "Quantidade atualizada." });
    } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
});

// ROTA PARA REMOVER UM ITEM DO CARRINHO
server.delete('/carrinho/itens/:id_item', async (request, reply) => {
    try {
        const { id_item } = request.params;
        await databaseCarrinhoItens.delete(id_item);
        return reply.status(204).send(); // Sucesso sem conteúdo
    } catch (error) {
        console.error("Erro ao remover item:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
});

////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
server.listen({
    host: '0.0.0.0', // Adicione para escutar em todas as interfaces de rede
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running on port 3333');
});
////////////////////////////////////////////////////////////////////////////////////