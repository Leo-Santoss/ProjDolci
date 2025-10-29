import { useState, useEffect } from 'react';
import { Button, Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import styles from './page.module.css';
import imagemDeDoces from '../../assets/images/doces_home.png';
import { useNavigate } from 'react-router-dom';

import DocesServices from '../../services/doces';

export default function Home() {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('auth'));

  const [produtosEmDestaque, setProdutosEmDestaque] = useState([]);
  const [loading, setLoading] = useState(true);

  const { listar } = DocesServices();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const todosOsProdutos = await listar();
        // Pega apenas os 3 primeiros itens da lista para o destaque
        setProdutosEmDestaque(todosOsProdutos.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar produtos para a home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Lógica para o botão "Ver Mais"
  const btnVerMais = () => {
    navigate('/doces');
  };

  // useEffect para o box de login (sua lógica original mantida)
  useEffect(() => {
    const boxLogin = document.getElementById("boxLogin");
    if (boxLogin) {
        if (!authData) {
            boxLogin.style.display = "flex";
        } else {
            boxLogin.style.display = "none";
        }
    }
  }, [authData]);

  return (
    <>
      {/* Seção de destaque */}
      <div className={styles.divCabecalho}>
        <h1 className={styles.tituloPagina}>Conheça nossos doces!</h1>
        <h2 className={styles.subTituloPagina}>
          A Dolci oferece uma grande variedade de doces gourmet de altíssima qualidade e do seu jeito! Experimente nossas delícias!
        </h2>
        <Button onClick={btnVerMais} variant="contained" className="botao">
          Ver Mais
        </Button>
      </div>

      {/* Imagem principal */}
      <div className={styles.divImgHome}>
        <img src={imagemDeDoces} alt="doces" className={styles.imgHome} />
      </div>

      {/* Seção de cards */}
      <Box sx={{ py: 6, px: { xs: 2, md: 6 }, backgroundColor: "#fff", flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}>
          Faça sua encomenda
        </Typography>

        {/* ATUALIZADO: Renderização condicional com base no estado de 'loading' */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid className={styles.gridCards}>
            {/* ATUALIZADO: Mapeia sobre os produtos reais do estado */}
            {produtosEmDestaque.map((item) => (
              <Grid item key={item.id} className={styles.gridCard}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={item.imagem ? `http://localhost:3333/uploads/${item.imagem}` : 'https://via.placeholder.com/400'}
                    alt={item.nome}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {item.descricao}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button onClick={btnVerMais} variant="contained" className="botao" fullWidth>
                      Ver Mais
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Box de Login (sua lógica original mantida) */}
      <Box id="boxLogin" sx={{ backgroundColor: "#deb995", display: "flex", alignItems: "center", justifyContent: "space-between", p: 4, borderRadius: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "black", ml: 2 }}>
          Já é um cliente?
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
          <Button variant="contained" sx={{ backgroundColor: "#69291b", "&:hover": { backgroundColor: "#4e1e13" } }}>
            Login
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#69291b", "&:hover": { backgroundColor: "#4e1e13" } }}>
            Cadastrar-se
          </Button>
        </Box>
      </Box>
    </>
  );
}