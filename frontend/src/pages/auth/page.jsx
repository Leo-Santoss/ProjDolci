import { useState } from "react"
import { TextField, Button } from "@mui/material"
import styles from './page.module.css'
import AuthServices from "../../services/auth"

export default function Auth(){
    const[formType, setFormType] = useState('login')
    const[FormData, setFormData] = useState(null)
    const { login, signup, authLoading } = AuthServices() 

    

    const hanleChangeFormType = () => {
        setFormData(null)
        if(formType === 'login'){
            setFormType('signup')
        }else{
            setFormType('login')
        }
    }

    const handleFormDataChange = (e) => {
        setFormData({
            ...FormData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        switch(formType){
            case 'login':
                login(FormData)
                
                break
            case 'signup':
                if(FormData.senha != FormData.confirmPassword){
                    console.log('Erro ao cadastrar! Senhas incompatíveis.')
                    return
                }
                
                signup(FormData)
                break
        }
    }

    return(
        <div className={styles.authPageContainer}>
            {formType === 'login' ? (
                <>
                    <h1>Entrar</h1>
                    <Button onClick={hanleChangeFormType}>Não tem uma conta? Cadastre-se</Button>
                    <form onSubmit={handleSubmitForm}>
                        <TextField 
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Senha"
                        type="password"
                        name="senha"
                        onChange={handleFormDataChange}
                        />
                        <Button type="submit">Entrar</Button>
                    </form>
                </>
            ) : null}
                
            {authLoading === true ? (
                <div className={styles.loading}>
                    <p>Carregando...</p>
                </div>
            ) :null}

            {formType === 'signup' ? (
                <>
                    <h1>Cadastre-se</h1>
                    <Button onClick={hanleChangeFormType}>Já tem uma conta? Entrar</Button>
                    <form onSubmit={handleSubmitForm}>
                        <TextField 
                        required
                        label="Nome"
                        type="fullname"
                        name="nome"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Senha"
                        type="password"
                        name="senha"
                        onChange={handleFormDataChange}
                        />
                        <TextField 
                        required
                        label="Confirme a senha"
                        type="password"
                        name="confirmPassword"
                        onChange={handleFormDataChange}
                        />
                        <Button type="submit">Cadastrar</Button>
                    </form>
                </>
            ) : null}
        </div>
    )
}