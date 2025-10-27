// src/pages/Carrinho/CarrinhoPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, IconButton, CircularProgress, Divider, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom'; // Se você usa react-router

import CarrinhoServices from '../../services/CarrinhoServices';

export default function Cart() {
    const { loading, getItensDoCarrinho, removerItem, atualizarQuantidadeItem } = CarrinhoServices();
    const [itens, setItens] = useState([]);

    useEffect(() => {
        const fetchItens = async () => {
            const data = await getItensDoCarrinho();
            setItens(data);
        };
        fetchItens();
    }, []);
    
    // Calcula o subtotal. useMemo evita recálculos desnecessários.
    const subtotal = useMemo(() => {
        return itens.reduce((total, item) => total + item.produto.preco * item.quantidade, 0);
    }, [itens]);

    // Funções para interagir com os itens (atualmente fictícias)
    const handleRemoverItem = (itemId) => {
        // Lógica real: Chamar a API e depois atualizar o estado
        removerItem(itemId);
        setItens(prevItens => prevItens.filter(item => item.id !== itemId));
    };

    const handleQuantidadeChange = (itemId, novaQuantidade) => {
        // Lógica real: Chamar a API e depois atualizar o estado
        if (novaQuantidade > 0) {
            atualizarQuantidadeItem(itemId, novaQuantidade);
            setItens(prevItens => prevItens.map(item => 
                item.id === itemId ? { ...item, quantidade: novaQuantidade } : item
            ));
        }
    };
    
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Meu Carrinho
            </Typography>

            {itens.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Seu carrinho está vazio.</Typography>
                    <Typography sx={{ mt: 1, mb: 3 }}>Adicione produtos para vê-los aqui.</Typography>
                    <Button component={Link} to="/" variant="contained">
                        Voltar para a Loja
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {/* Coluna dos Itens */}
                    <Grid item xs={12} md={8}>
                        {itens.map((item) => (
                            <Paper key={item.id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                                <img src={item.produto.imagem} alt={item.produto.nome} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }} />
                                <Box sx={{ flexGrow: 1, ml: 2 }}>
                                    <Typography variant="h6">{item.produto.nome}</Typography>
                                    <Typography color="text.secondary">
                                        {item.quantidade} x R$ {item.produto.preco.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton size="small" onClick={() => handleQuantidadeChange(item.id, item.quantidade - 1)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography sx={{ mx: 1 }}>{item.quantidade}</Typography>
                                    <IconButton size="small" onClick={() => handleQuantidadeChange(item.id, item.quantidade + 1)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h6" sx={{ minWidth: '100px', textAlign: 'right', ml: 2 }}>
                                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                                </Typography>
                                <IconButton sx={{ ml: 1 }} color="error" onClick={() => handleRemoverItem(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Grid>

                    {/* Coluna do Resumo */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom>Resumo do Pedido</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal ({itens.length} itens)</Typography>
                                <Typography>R$ {subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Frete</Typography>
                                <Typography>A calcular</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">R$ {subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ mt: 3 }}
                                onClick={() => alert('Ação de finalizar compra ainda não implementada.')} // Ação fictícia
                            >
                                Finalizar Compra
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}