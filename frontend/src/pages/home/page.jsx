import { Button, Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import styles from './page.module.css';
import imagemDeDoces from '../../assets/images/doces_home.png';
import imagemBolo from '../../assets/images/bolo_de_chocolate.png';
import imagemPudim from '../../assets/images/pudim.png';
import imagemVitrine from '../../assets/images/vitrine.png';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate()
  const btnVerMais = () => {
    navigate('/doces');
  };

  const items = [
    {
      title: "Bolos",
      img: imagemBolo,
      text: "Corpo de texto para adicionar mais informações, além do subtítulo.",
    },
    {
      title: "Doces",
      img: imagemVitrine,
      text: "Corpo de texto para adicionar mais informações, além do subtítulo.",
    },
    {
      title: "Pudim",
      img: imagemPudim,
      text: "Corpo de texto para adicionar mais informações, além do subtítulo.",
    },
  ];

  return (
    <>
      {/* Seção de destaque */}
      <div className={styles.divCabecalho}>
        <h1 className={styles.tituloPagina}>Conheça nossos doces!</h1>
        <h2 className={styles.subTituloPagina}>
          A Dolci oferece uma grande variedade de doces gourmet de altíssima qualidade e do seu jeito! Experimente nossas delícias!
        </h2>

      <Button
              onClick={btnVerMais}
              variant="contained"
              class="botao"
            >
            ver mais
        </Button>


      </div>

      {/* Imagem principal */}
      <div className={styles.divImgHome}>
        <img src={imagemDeDoces} alt="doces" className={styles.imgHome} />
      </div>

      {/* Seção de cards */}
      <Box sx={{ py: 6, px: { xs: 2, md: 6 }, backgroundColor: "#fff",
        flexWrap: 'wrap' }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}
        >
          Faça sua encomenda
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {items.map((item) => (
            <Grid item key={item.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={item.img}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.text}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    onClick={btnVerMais}
                    variant="contained"
                    class="botao"
                    fullWidth
                  >
                    ver mais
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
            sx={{
                backgroundColor: "#deb995", // cor de fundo (bege)
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 4,
                borderRadius: 1,
            }}
            >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "black", ml: 2 }}
            >
                Já é um cliente?
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mr: 2 }}>
                <Button
                variant="contained"
                sx={{
                    backgroundColor: "#69291b",
                    "&:hover": { backgroundColor: "#4e1e13" },
                }}
                >
                Login
                </Button>
                <Button
                variant="contained"
                sx={{
                    backgroundColor: "#69291b",
                    "&:hover": { backgroundColor: "#4e1e13" },
                }}
                >
                Cadastrar-se
                </Button>
            </Box>
        </Box>
    </>
  );
}
