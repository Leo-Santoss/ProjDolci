import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button, TextField, Select, InputLabel, MenuItem } from "@mui/material"
import AuthServices from "../../services/auth"
import styles from './page.module.css'

export default function Profile(){
    const { logout } = AuthServices()
    const navigate = useNavigate()
    const authData = JSON.parse(localStorage.getItem('auth'))

    useEffect(() => {
        if (!authData){
            navigate('/auth') // Apenas chame a função, não a retorne
        }
    },[authData, navigate])

    const handleSave = () => {
        console.log('Dados salvos')
    }

    const handleLogout = () =>{
        logout()
        return navigate('/')
    }

    if (!authData) {
        return null; // ou <div>Redirecionando...</div>
    }

    return(
        <>
            <div className={styles.dadosPerfil}>
                <h1>Perfil</h1>
                <div className={styles.campos}>
                    <InputLabel id="demo-simple-select-label">Nome</InputLabel>
                    <TextField required className={styles.campoTexto} type="name" name="nome" value={authData.user.nome}/>
                </div>
                <div className={styles.campos}>
                    <InputLabel id="demo-simple-select-label">Email</InputLabel>
                    <TextField required className={styles.campoTexto} type="email" name="email" value={authData.user.email}/>
                </div>
                <div className={styles.campos}>
                    <InputLabel id="demo-simple-select-label">Tipo de Acesso</InputLabel>
                    <Select className={styles.campoTexto}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={authData.user.tipo_acesso}
                        >
                        <MenuItem value={0}>Consumidor</MenuItem>
                        <MenuItem value={1}>Colaborador</MenuItem>
                    </Select>
                </div>
                <div className={styles.botoes}>
                    <Button onClick={handleSave} class="botao">Salvar</Button>
                    <Button onClick={handleLogout} class="botao">Sair</Button>
                </div>
            </div>
        </>
    )
}