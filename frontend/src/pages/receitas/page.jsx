import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, CircularProgress, Paper } from '@mui/material';
import DocesServices from "../../services/doces"; // Ajuste o caminho se necessário
import styles from './page.module.css'; // Supondo que você tenha um CSS module

export default function Receitas() {
    const [produtosComReceita, setProdutosComReceita] = useState([]);
    const [loading, setLoading] = useState(true);
    const { listarComReceitas } = DocesServices();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReceitas = async () => {
            try {
                const data = await listarComReceitas();
                setProdutosComReceita(data);
            } catch (error) {
                console.error("Erro ao carregar receitas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReceitas();
    }, []);

    // Função para navegar para a página de detalhes do doce
    const handleCardClick = (produtoId) => {
        navigate('/doces', { state: { produtoId: produtoId } }); 
     };
    
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.tituloPagina}>Receitas para Fazer em Casa</h1>
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
                Descubra os segredos dos nossos doces mais amados e experimente prepará-los na sua cozinha!
            </Typography>

            {produtosComReceita.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Nenhuma receita encontrada no momento.</Typography>
                    <Typography sx={{ mt: 1 }}>Volte em breve para mais novidades!</Typography>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {produtosComReceita.map((produto) => (
                        <Grid item key={produto.id} xs={12} sm={6} md={4}>
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
                                <CardActionArea onClick={() => handleCardClick(produto.id)} title={`Ver detalhes e receita de ${produto.nome}`}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={produto.imagem ? `http://localhost:3333/uploads/${produto.imagem}` : 'https://via.placeholder.com/400'}
                                        alt={produto.nome}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                            {produto.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Clique para ver os detalhes e aprender a fazer esta delícia em casa.
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}