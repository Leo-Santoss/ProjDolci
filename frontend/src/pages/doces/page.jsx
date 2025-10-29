// Doces.jsx / page.jsx
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, IconButton, Divider, Button, Select, MenuItem, FormControl, InputLabel, Modal, CircularProgress, Backdrop } from '@mui/material';
import { MdFavorite, MdClose } from "react-icons/md";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Swal from 'sweetalert2'

// Importe seus serviços
import DocesServices from "../../services/doces";
import ReceitasServices from "../../services/ReceitasServices";
import CarrinhoServices from "../../services/CarrinhoServices";
import imgReceita from "../../assets/images/receitas.png";

// Componente para as estrelas de avaliação
const RatingStars = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Array(rating || 0).fill('★').join('');
    const emptyStars = Array(totalStars - (rating || 0)).fill('★').join('');
    return (
        <Typography variant="body2" sx={{ display: 'inline-block' }}>
            <span style={{ color: '#FBC02D' }}>{filledStars}</span>
            <span style={{ color: 'lightgray' }}>{emptyStars}</span>
        </Typography>
    );
};

export default function Doces() {
    // --- Serviços ---
    const { listar: listarDoces } = DocesServices();
    const { getByProdutoId } = ReceitasServices();
    const { adicionarItem } = CarrinhoServices();
    
    // --- Estados de Controle ---
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [receita, setReceita] = useState(null);

    // --- Estados do Formulário de Compra ---
    const [tamanho, setTamanho] = useState('normal');
    const [quantidade, setQuantidade] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    // --- Carregamento Inicial ---
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const data = await listarDoces();
                setProdutos(data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProdutos();
    }, []);

    // --- Handlers de Ações ---
    const handleProductClick = (produto) => {
        setSelectedProduct(produto);
        setTamanho('normal');
        setQuantidade(1);
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
    };

    const handleShowRecipe = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        try {
            const data = await getByProdutoId(selectedProduct.id);
            setReceita(data);
            setShowRecipeModal(true);
        } catch (error) {
            console.error("Erro ao buscar receita:", error);
            Swal.fire({
                title: 'Aviso!',
                text: 'Receita não encontrada para este produto!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseRecipe = () => setShowRecipeModal(false);

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
        setAddingToCart(true);
        try {
            await adicionarItem({
                id_produto: selectedProduct.id,
                quantidade: quantidade,
                preco_unitario: selectedProduct.preco
            });
            Swal.fire({
                title: 'Sucesso!',
                text: `${quantidade}x ${selectedProduct.nome} (${tamanho}) adicionado ao carrinho!`,
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            handleBackToList();
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro inesperado ao adicionar ao carrinho!',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            console.log(error.message);
        } finally {
            setAddingToCart(false);
        }
    };
    
    // --- RENDERIZAÇÃO ---
    if (loading && !selectedProduct) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    // TELA DE DETALHES DO PRODUTO
    if (selectedProduct) {
        return (
            <div className={styles.container}>
                <div className={styles.cabecalho}>
                    <Button onClick={handleBackToList} class="botao" sx={{ mb: 2 }}>&larr;</Button>
                    <h1 className={styles.tituloDoce}>{selectedProduct.nome}</h1>
                </div>
                <Grid className={styles.gridProdutoSelecionado}>
                    <div className={styles.divEsquerda}>
                        <div className={styles.divEsquerdaCima}>
                            <Grid className={styles.divImgProduto}>
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:3333/uploads/${selectedProduct.imagem}`}
                                    alt={selectedProduct.nome}
                                    className={styles.imgProduto}
                                />
                            </Grid>
                        </div>
                        <div className={styles.divEsquerdaBaixo}>
                            <div className={styles.divPersonalizacao}>
                                <h1 className={styles.tituloPersonalizacao}>Personalização</h1>
                                <FormControl fullWidth>
                                    <InputLabel>Quantidade</InputLabel>
                                    <Select value={quantidade} label="Quantidade" onChange={(e) => setQuantidade(e.target.value)}>
                                        {[...Array(10).keys()].map(n => <MenuItem key={n+1} value={n+1}>{n+1}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Tamanho</InputLabel>
                                    <Select value={tamanho} label="Tamanho" onChange={(e) => setTamanho(e.target.value)}>
                                        <MenuItem value="pequeno">Pequeno</MenuItem>
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="grande">Grande</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className={styles.divDireita}>
                        <Grid className={styles.divDireitaCima}>
                            <Typography className={styles.campoDescricao}>{selectedProduct.descricao}</Typography>
                            <Typography className={styles.campoIngredientes}><strong>Ingredientes:</strong> {selectedProduct.ingredientes}</Typography>
                            
                            <Typography  className={styles.campoPreco}><strong>R$ {parseFloat(selectedProduct.preco).toFixed(2)}/{selectedProduct.tipo_de_medida}</strong></Typography>
                            
                            
                            <Button
                                variant="contained"
                                startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                size="large"
                                fullWidth
                                className={styles.botaoAdicionar}
                                sx={{ mb: 2 }}
                            >
                                {addingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                            </Button>
                        </Grid>
                        <div className={styles.divDireitaBaixo}>
                            <div className={styles.divFazerEmCasa}>
                                <h1 className={styles.tituloReceitas}>Quer fazer em casa? <img src={imgReceita} className={styles.imgReceitaEstilo} alt="receita" /></h1>
                                <Button variant="outlined" onClick={handleShowRecipe} size="large" className={styles.botaoFazerEmCasa} fullWidth>
                                    Ver Receita
                                </Button>
                            </div>
                        </div>
                    </div>
                </Grid>

                {/* MODAL DA RECEITA ATUALIZADO */}
                <Modal open={showRecipeModal} onClose={handleCloseRecipe} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
                    <Box className={styles.modal}>
                        <IconButton onClick={handleCloseRecipe} sx={{ position: 'absolute', top: 8, right: 8 }}><MdClose /></IconButton>
                        {loading ? <CircularProgress /> : (
                            receita ? (
                                <>
                                    <h1 className={styles.tituloModal}>Receita: {selectedProduct.nome}</h1>
                                    <div className={styles.conteudoModal}>
                                        <div className={styles.ladoEsquerdoModal}>
                                            <div className={styles.infoReceita}>
                                                <Typography fontSize={'20px'}><strong>Tempo de Preparo:</strong> {receita.tempo_preparo_minutos} minutos</Typography>
                                                <Typography fontSize={'20px'}><strong>Rendimento:</strong> {receita.rendimento}</Typography>
                                            </div>
                                            <Divider sx={{ my: 2 }}/>
                                            <Typography variant="h6">Ingredientes:</Typography>
                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{receita.ingredientes}</Typography>
                                            <Divider sx={{ my: 2 }}/>
                                            <Typography variant="h6">Modo de Preparo:</Typography>
                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{receita.modo_de_preparo}</Typography>
                                            <Divider sx={{ my: 2 }}/>
                                        </div>
                                        <div className={styles.ladoDireitoModal}>
                                            {/* =========== NOVO BLOCO DE CÓDIGO PARA AS IMAGENS =========== */}
                                            {(receita.imagem_passo1 || receita.imagem_passo2 || receita.imagem_passo3) && (
                                                <>
                                                    <Typography fontSize={'20px'}><strong>Passo a Passo Visual:</strong></Typography>
                                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                                        {receita.imagem_passo1 && (
                                                            <CardMedia className={styles.imagemPassos} component="img" image={`http://localhost:3333/uploads/${receita.imagem_passo1}`} alt="Passo 1" sx={{ width: '100%', borderRadius: 1 }}/>
                                                        )}
                                                        {receita.imagem_passo2 && (
                                                            <CardMedia className={styles.imagemPassos} component="img" image={`http://localhost:3333/uploads/${receita.imagem_passo2}`} alt="Passo 2" sx={{ width: '100%', borderRadius: 1 }}/>
                                                        )}
                                                        {receita.imagem_passo3 && (
                                                            <CardMedia className={styles.imagemPassos} component="img" image={`http://localhost:3333/uploads/${receita.imagem_passo3}`} alt="Passo 3" sx={{ width: '100%', borderRadius: 1 }}/>
                                                        )}
                                                    </Grid>
                                                </>
                                            )}
                                            {/* ======================= FIM DO NOVO BLOCO ======================= */}
                                        </div>
                                    </div>


                                </>
                            ) : <Typography>Receita não disponível.</Typography>
                        )}
                    </Box>
                </Modal>
            </div>
        );
    }
    
    // TELA PRINCIPAL (LISTA DE PRODUTOS)
    return (
        <>
            <h1 className={styles.tituloPagina}>Doces</h1>
            <div className={styles.cardContainer}>
                <Box sx={{ py: 2, px: { xs: 2, md: 6 }, backgroundColor: "#fffcfcff", overflowY: "auto", justifyContent: "center"}}>
                    <Grid container spacing={3}>
                        {produtos.map((item) => (
                            <Grid item key={item.id} xs={12} sm={6} md={4} >
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, boxShadow: 'none', border: '1px solid #eee', maxWidth:"200px" }}>
                                    <CardActionArea onClick={() => handleProductClick(item)}>
                                        <CardMedia  
                                            component="img"
                                            height="200"
                                            image={item.imagem ? `http://localhost:3333/uploads/${item.imagem}` : 'https://via.placeholder.com/200'}
                                            alt={item.nome}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.nome}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5, mb: 1, fontSize: '0.9rem', widht: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.descricao}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <Divider light />
                                    <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                        <Box>
                                            <RatingStars rating={item.rating} />
                                            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700 }}>
                                                R$ {parseFloat(item.preco).toFixed(2)} / {item.tipo_de_medida}
                                            </Typography>
                                        </Box>
                                        <IconButton aria-label="Adicionar aos favoritos"><MdFavorite fontSize="small" /></IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        </>
    );
}