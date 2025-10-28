import styles from './Navbar.module.css';
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";
import { useState } from 'react';
import {Link} from 'react-router-dom';


export default function Navbar(){
    const [openMenu, setOpenMenu] = useState(false);
    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    }


    return(
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarItems}>
                <Link to={'/'}>
                    <h1 className={styles.logo}>DOLCI</h1>
                </Link>
                <div className={styles.navbarLinksContainer}>
                    
                    <Link to={'/'} className={styles.navbarLink}>Home</Link>
                    <Link to={'/doces'} className={styles.navbarLink}>Doces</Link>

                    <Link to={'/cart'}>
                        <LuShoppingCart className={styles.icons}/>
                    </Link>

                    <Link to={'/profile'}>
                        <LuUser className={styles.icons}/>
                    </Link>
                </div>
            </div>

            <div className={styles.mobileNavbarItems}>
                <Link to={'/'}>
                    <h1 className={styles.logo}>Dolci</h1>
                </Link>
                <div className={styles.mobileNavbarBtns}>
                    <Link to={'/cart'}>
                        <LuShoppingCart className={styles.navbarLink}/>
                    </Link>
                    <LuMenu className={styles.navbarLink} onClick={handleOpenMenu}/>
                </div>
            </div>

            <Drawer anchor='right' open={openMenu} onClose={handleOpenMenu}>
                <div className={styles.drawer}>
                    <Link to={'/'} className={styles.navbarLink}>Home</Link>
                    <Link to={'/doces'} className={styles.navbarLink}>Doces</Link>
                    <Link to={'/profile'} className={styles.navbarLink}>Perfil</Link>
                </div>
            </Drawer>


        </nav>
    )
}