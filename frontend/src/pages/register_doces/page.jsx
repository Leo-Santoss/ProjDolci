import { useState, useEffect } from "react";
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Box, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { styled } from '@mui/material/styles';
import { LuCloudUpload } from "react-icons/lu"; // Adicionando import que faltava
import Swal from 'sweetalert2'

import styles from './page.module.css';
import DocesServices from "../../services/doces";
import ReceitasServices from "../../services/ReceitasServices";

// --- Modelos de dados iniciais ---
const initialProdutoFormData = { id: null, nome: '', descricao: '', ingredientes: '', preco: '', tipo_de_medida: '' };
const initialReceitaFormData = { id: null, id_produto: null, ingredientes: '', modo_de_preparo: '', tempo_preparo_minutos: '', rendimento: '' };

const VisuallyHiddenInput = styled('input')({ 
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
 });

export default function RegistrarDoces() {
    // --- Serviços ---
    const { loading: loadingDoces, listar, cadastrar, editar, excluir } = DocesServices();
    const { loading: loadingReceitas, getByProdutoId, salvar: salvarReceita } = ReceitasServices();

    // --- Estados de Controle ---
    const [modo, setModo] = useState('LISTA'); // LISTA, FORM_PRODUTO, FORM_RECEITA
    const [doces, setDoces] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    
    // --- Estados dos Formulários ---
    const [produtoFormData, setProdutoFormData] = useState(initialProdutoFormData);
    const [receitaFormData, setReceitaFormData] = useState(initialReceitaFormData);
    const [produtoImagemFile, setProdutoImagemFile] = useState(null);
    const [receitaFiles, setReceitaFiles] = useState({ imagem_passo1: null, imagem_passo2: null, imagem_passo3: null });
    const [produtoFileName, setProdutoFileName] = useState('');

    // --- Carregamento Inicial da Lista ---
    const fetchDoces = async () => {
        setListLoading(true);
        try {
            const data = await listar();
            setDoces(data);
        } catch (error) {
            console.error("Erro ao buscar doces:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível carregar a lista de doces!',
                icon: 'error',
                confirmButtonText: 'ok'
            })
        } finally {
            setListLoading(false);
        }
    };
    useEffect(() => { fetchDoces(); }, []);

    // --- Handlers de Navegação ---
    const handleAbrirFormCadastroProduto = () => {
        setProdutoFormData(initialProdutoFormData);
        setProdutoImagemFile(null);
        setProdutoFileName('');
        setModo('FORM_PRODUTO');
    };
    const handleAbrirFormEdicaoProduto = (doce) => {
        setProdutoFormData(doce);
        setProdutoImagemFile(null);
        setProdutoFileName(doce.imagem || '');
        setModo('FORM_PRODUTO');
    };

    const handleAbrirFormReceita = async (doce) => {
        try {
            const receitaExistente = await getByProdutoId(doce.id);
            if (receitaExistente) {
                setReceitaFormData(receitaExistente);
            } else {
                setReceitaFormData({ ...initialReceitaFormData, id_produto: doce.id });
            }
            setModo('FORM_RECEITA');
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao buscar receita!',
                icon: 'error',
                confirmButtonText: 'ok'
            })
            console.log(error.message);
        }
    };
    
    const handleCancelar = () => { setModo('LISTA'); };

    // --- Handlers de Formulários (Produto) - FUNÇÕES IMPLEMENTADAS ---
    const handleProdutoFormChange = (e) => {
        setProdutoFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleProdutoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProdutoFileName(file.name);
            setProdutoImagemFile(file);
        }
    };
    const handleProdutoSubmit = (e) => {
        e.preventDefault();
        const promise = produtoFormData.id
            ? editar(produtoFormData.id, produtoFormData, produtoImagemFile)
            : cadastrar(produtoFormData, produtoImagemFile);
        
        promise.then(() => {
            Swal.fire({
                title: 'Sucesso!',
                text: `Produto ${produtoFormData.id ? 'atualizado' : 'cadastrado'} com sucesso!`,
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            setModo('LISTA');
            fetchDoces();
        }).catch(error => {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao salvar produto!',
                icon: 'error',
                confirmButtonText: 'ok'
            })
            console.log(error.message);
        });
    };
    const handleProdutoDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            excluir(id).then(() => {
                Swal.fire({
                    title: 'Sucesso!',
                    text: `Produto excluído com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })
                fetchDoces();
            }).catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao excluir produto!',
                    icon: 'error',
                    confirmButtonText: 'ok'
                })
                 console.log(error.message);
            });
        }
    };

    // --- Handlers de Formulários (Receita) ---
    const handleReceitaFormChange = (e) => {
        setReceitaFormData({ ...receitaFormData, [e.target.name]: e.target.value });
    };
    const handleReceitaFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setReceitaFiles(prev => ({ ...prev, [name]: files[0] }));
        }
    };
    const handleReceitaSubmit = (e) => {
        e.preventDefault();
        salvarReceita(receitaFormData, receitaFiles)
            .then(() => {
                Swal.fire({
                    title: 'Sucesso!',
                    text: `Receita salva com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                })
                setModo('LISTA');
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao salvar receita!',
                    icon: 'error',
                    confirmButtonText: 'ok'
                })
                console.log(error.message);
            });
    };

    // --- RENDERIZAÇÃO ---
    if (listLoading) { 
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>; 
    }
    const loading = loadingDoces || loadingReceitas;

    // ----- MODO LISTA -----
    if (modo === 'LISTA') {
        return (
            <div className={styles.container}>
                <div className={styles.tituloGerenciar}>
                    <h1 className={styles.tituloPagina}>Gerenciar Produtos</h1>
                    <Button class="botao" variant="contained" style={{ backgroundColor: "#094848" }} onClick={handleAbrirFormCadastroProduto}>
                        Cadastrar Novo Produto
                    </Button>
                </div>
                <div className={styles.divLista}>
                    <List>
                        {doces.map((doce) => (
                            <ListItem key={doce.id} divider>
                                <ListItemText primary={doce.nome} secondary={`Preço: R$ ${doce.preco}`} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" title="Editar Receita" onClick={() => handleAbrirFormReceita(doce)}>
                                        <MenuBookIcon />
                                    </IconButton>
                                    <IconButton edge="end" title="Editar Produto" onClick={() => handleAbrirFormEdicaoProduto(doce)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" title="Excluir Produto" onClick={() => handleProdutoDelete(doce.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        );
    }
    
    // ----- MODO FORMULÁRIO DE PRODUTO (CORRIGIDO) -----
    if (modo === 'FORM_PRODUTO') {
        return (
           <div className={styles.container}>
                <h1 className={styles.tituloPagina}>{produtoFormData.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h1>
                <form onSubmit={handleProdutoSubmit}>
                    <div className={styles.cadastrarDoces}>
                         <div className={styles.formularioCampos}>
                            <TextField fullWidth required label="Nome" name="nome" value={produtoFormData.nome} onChange={handleProdutoFormChange} sx={{ mb: 2 }} />
                            <TextField fullWidth required label="Descrição" name="descricao" value={produtoFormData.descricao} onChange={handleProdutoFormChange} multiline rows={4} sx={{ mb: 2 }}/>
                            <TextField fullWidth required label="Ingredientes" name="ingredientes" value={produtoFormData.ingredientes} onChange={handleProdutoFormChange} multiline rows={4} sx={{ mb: 2 }}/>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField fullWidth required label="Tipo de Medida" name="tipo_de_medida" value={produtoFormData.tipo_de_medida} onChange={handleProdutoFormChange} />
                                <TextField fullWidth required label="Preço" name="preco" value={produtoFormData.preco} onChange={handleProdutoFormChange} type="number" />
                            </Box>
                         </div>
                         <div className={styles.linhaUpload}>
                            <div className={styles.fundoBotaoProduto}>
                                <Button className={styles.botaoFotoProduto} component="label" variant="contained" startIcon={<LuCloudUpload />} style={{ backgroundColor: "#094848" }}>
                                    Enviar imagem
                                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleProdutoFileChange} />
                                </Button>
                            </div>
                            {produtoFileName && <Typography variant="body1" sx={{ ml: 2 }}>{produtoFileName}</Typography>}
                         </div>
                    </div>
                    <div className={styles.divBotoes}>    
                        <Button class="botao" type="submit" variant="contained" style={{width:"20%"}} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : (produtoFormData.id ? 'Salvar Alterações' : 'Cadastrar')}
                        </Button>
                        <Button class="botao" variant="outlined" style={{width:"20%"}} onClick={handleCancelar}>
                            Cancelar
                        </Button>
                    </div>
                </form>
           </div>
        );
    }

    // ----- MODO FORMULÁRIO DE RECEITA -----
    if (modo === 'FORM_RECEITA') {
        return (
            <div className={styles.container}>
                <h1 className={styles.tituloPagina}>
                    {receitaFormData.id ? 'Editar Receita' : 'Cadastrar Nova Receita'}
                </h1>
                <form className={styles.form} onSubmit={handleReceitaSubmit}>
                    <div className={styles.ladoUm}>
                        <TextField label="Ingredientes" name="ingredientes" value={receitaFormData.ingredientes} onChange={handleReceitaFormChange} fullWidth multiline rows={6} margin="normal" required />
                        <TextField label="Modo de Preparo" name="modo_de_preparo" value={receitaFormData.modo_de_preparo} onChange={handleReceitaFormChange} fullWidth multiline rows={8} margin="normal" required />
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextField 
                                label="Tempo de Preparo (minutos)" 
                                name="tempo_preparo_minutos" 
                                value={receitaFormData.tempo_preparo_minutos} 
                                onChange={handleReceitaFormChange} 
                                fullWidth 
                                required 
                                type="number" 
                            />
                            <TextField label="Rendimento (ex: 8 porções)" name="rendimento" value={receitaFormData.rendimento} onChange={handleReceitaFormChange} fullWidth required />
                        </Box>
                    </div>
                    <div className={styles.ladoDois}>
                        <Box sx={{ display: 'flex', gap: 4, mt: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <div className={styles.fundoBotao}>
                                <Button className={styles.botaoFoto} variant="outlined" component="label">Imagem 1<input type="file" name="imagem_passo1" hidden onChange={handleReceitaFileChange} accept="image/*" /></Button>
                            </div>
                            <div className={styles.fundoBotao}>
                                <Button className={styles.botaoFoto} variant="outlined" component="label">Imagem 2<input type="file" name="imagem_passo2" hidden onChange={handleReceitaFileChange} accept="image/*" /></Button>
                            </div>
                            <div className={styles.fundoBotao}>
                                <Button className={styles.botaoFoto} variant="outlined" component="label">Imagem 3<input type="file" name="imagem_passo3" hidden onChange={handleReceitaFileChange} accept="image/*" /></Button>
                            </div>
                            <Typography>{Object.values(receitaFiles).filter(f => f).map(f => f.name).join(', ')}</Typography>
                        </Box>

                    </div>
                </form>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, alignContent: 'center', justifyContent: 'center'}} fullWidth>
                    <Button class="botao" type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Salvar Receita'}
                    </Button>
                    <Button class="botao" variant="outlined" onClick={handleCancelar}>Cancelar</Button>
                </Box>
            </div>
        );
    }
    
    return null;
}