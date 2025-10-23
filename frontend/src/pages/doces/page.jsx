import styles from './page.module.css';
import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton, Divider  } from '@mui/material';
// import FavoriteBorderIcon from '@mui/material/FavoriteBorder';
import { MdFavorite } from "react-icons/md";
import imagemBolo from '../../assets/images/bolo_de_chocolate.png';
import imagemPudim from '../../assets/images/pudim.png';
import imagemBoloNinho from '../../assets/images/bolo_de_ninho.png';
import imagemEclair from '../../assets/images/eclair.png';
import imagemBeijinho from '../../assets/images/beijinho.png';
// import imagemBrigadeiro from '../../assets/images/brigadeiro.png';

// Array de exemplo
const defaultItems = [
    { title: "Brigadeiro", text: "Descrição do primeiro produto", price: "R$5,00", unit: "Unidade", img: imagemBeijinho, rating: 4 },
    { title: "Beijinho", text: "Descrição do segundo produto", price: "R$7,00", unit: "Unidade", img: imagemBeijinho, rating: 3 },
    { title: "Pudim de leite", text: "Descrição do terceiro produto", price: "R$12,00", unit: "Fatia", img: imagemPudim, rating: 5 },
    { title: "Bolo de Chocolate", text: "Descrição do quarto produto", price: "R$12,00", unit: "Pedaço", img: imagemBolo, rating: 4 },
    { title: "Eclair", text: "Descrição do quinto produto", price: "R$5,00", unit: "Unidade", img: imagemEclair, rating: 3 },
    { title: "Bolo de Ninho", text: "Descrição do sexto produto", price: "R$15,00", unit: "Pedaço", img: imagemBoloNinho, rating: 4 },
];

const RatingStars = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Array(rating).fill('★').join('');
    const emptyStars = Array(totalStars - rating).fill('★').join('');
    return (
        <Typography variant="body2" sx={{ display: 'inline-block' }}>
            <span style={{ color: '#FBC02D' }}>{filledStars}</span>
            <span style={{ color: 'lightgray' }}>{emptyStars}</span>
        </Typography>
    );
};

export default function Doces({ items }) {
    const productItems = items || defaultItems;

    return (
        <>
            <h1 className={styles.tituloPagina}>Doces</h1>
            <div className={styles.cardContainer}>   
                <Box 
                    sx={{ 
                        py: 6, 
                        px: { xs: 2, md: 6 }, 
                        backgroundColor: "#fffcfcff",
                        // altura máxima do container
                        overflowY: "auto"
                        
                    }}
                >
                    <Grid container spacing={3}>
                        {productItems.map((item) => (
                            <Grid 
                                item 
                                key={item.title} 
                                xs={12} // 1 card por linha em telas extra-pequenas
                                sm={6}  // 2 cards por linha em telas pequenas
                                md={4}  // 3 cards por linha em telas médias e maiores
                            >
                                <Card
                                    sx={{
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        border: '1px solid #eee',
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        width="100"
                                        image={item.img}
                                        alt={item.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    
                                    <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                                            {item.text}
                                        </Typography>
                                    </CardContent>

                                    <Divider light />
                                    <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <RatingStars rating={item.rating} />
                                            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700 }}>
                                                {item.price} / {item.unit}
                                            </Typography>
                                        </Box>

                                        <IconButton aria-label="Adicionar aos favoritos">
                                            <MdFavorite fontSize="small" />
                                        </IconButton>
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
