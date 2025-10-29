import styles from './footer.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton, Button } from '@mui/material';
import { LuFacebook, LuInstagram, LuYoutube, LuLinkedin } from "react-icons/lu";
import { useEffect } from 'react';

export default function Footer() {
    
    const authData = JSON.parse(localStorage.getItem('auth'))
    const navigate = useNavigate();

    const goLogin = () => {
        navigate('/auth');
    };

    
  useEffect(() => {
          if (!authData) {
            document.getElementById("boxLogin").style.display = "flex";
          } else {
            document.getElementById("boxLogin").style.display = "none";
          }
      }, [authData])

    return (
        <Box component="footer" className={styles.footerContainer}>
            <Container maxWidth="lg">
                <Grid container spacing={25} justifyContent="center">

                    {/* Coluna 1: Logo e Redes Sociais */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h5" component="h4" className={styles.dolciTitle}>
                            DOLCI
                        </Typography>
                        <Typography variant="body2" className={styles.socialSubtitle}>
                            Nos siga nas redes
                        </Typography>
                        <Box className={styles.socialIcons}>
                            <Link to={'/'} className={styles.socialIcon}> 
                                <LuFacebook />
                            </Link>
                            <Link to={'/'} className={styles.socialIcon}> 
                                <LuLinkedin />
                            </Link>
                            <Link to={'/'} className={styles.socialIcon}> 
                                <LuYoutube />
                            </Link>
                            <Link to={'/'} className={styles.socialIcon}> 
                                <LuInstagram />
                            </Link>
                        </Box>
                    </Grid>

                    {/* Coluna 2: Links - Mais Pedidos */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" className={styles.sectionTitle}>
                            Mais Pedidos
                        </Typography>
                        <Link to={'/doces'} className={styles.footerLink}>Brigadeiro</Link>
                        <Link to={'/doces'} className={styles.footerLink}>Bolo de cenoura</Link>
                        <Link to={'/doces'} className={styles.footerLink}>Pudim</Link>
                    </Grid>

                    {/* Coluna 3: Links - Páginas do site */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle1" className={styles.sectionTitle}>
                            Páginas do site
                        </Typography>
                        <Link to={'/doces'} className={styles.footerLink}>Produtos</Link>
                        <Link to={'/cart'} className={styles.footerLink}>Encomendar</Link>
                        <Link to={'/receitas'} className={styles.footerLink}>Receitas</Link>
                    </Grid>

                    {/* Coluna 4: Colaboradores */}
                    <Grid item xs={12} sm={6} md={3} id="boxLogin">
                        <Typography variant="subtitle1" className={styles.sectionTitle}>
                            Colaboradores
                        </Typography>
                        <Button variant="contained" class="botao" onClick={goLogin}>
                            Login
                        </Button>
                    </Grid>
                </Grid>

                <Typography variant="body2" align="center" className={styles.copyrightText}>
                    © 2025 DOLCI. Todos os direitos reservados.
                </Typography>
            </Container>
        </Box>
    )
}