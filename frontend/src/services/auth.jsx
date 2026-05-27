import { useState } from "react";

export default function AuthServices(){
    const [authLoading, setAuthLoading] = useState(false)
    
    const url = 'https://dolciapi.onrender.com/api/usuarios'

    const login = (formData) => {
        setAuthLoading(true)
        
        fetch(`${url}/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'            
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then((result) => {
            if(result.success && result.token){
                localStorage.setItem('auth', JSON.stringify({user: result.user, token: result.token}))
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setAuthLoading(false)
        })

    }


    const logout = () => {
        localStorage.removeItem('auth')
    }

    const signup = (formData) => {
         setAuthLoading(true)
        
        fetch(`${url}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'            
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    return{
        signup,
        login,
        logout,
        authLoading
    }
}