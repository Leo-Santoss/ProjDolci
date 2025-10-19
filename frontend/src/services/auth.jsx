import { useState } from "react";

export default function AuthServices(){
    const [authLoading, setAuthLoading] = useState(false)
    
    const url = 'http://localhost:3333/auth/user'

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
        
        fetch(`${url}/register`,{
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