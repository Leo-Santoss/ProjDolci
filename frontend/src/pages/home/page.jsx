import { Button } from '@mui/material';
import styles from './page.module.css';
import imagemDeDoces from '../../assets/images/doces_home.png';


export default function Home(){
    return(
        <>
            <div className={styles.divCabecalho}>
                <h1 className={styles.tituloPagina}>Conheça nossos doces!</h1>
                <h2 className={styles.subTituloPagina}>A Dolci ofere uma grande variedade de doces gourmet de altíssima qualidade e do seu jeito! Experimente nossas delícias!</h2>
                <Button class="botao">Ver Mais</Button>
            </div>

            <div className={styles.divImgHome}>
                <img src={imagemDeDoces} alt='doces' className={styles.imgHome}/>
            </div>

            <div>

            </div>
        </>
    )
}