export default function Profile(){

    const authData = JSON.parse(localStorage.getItem('authData'))

    console.log(authData)
    return(
        <h1>Profile</h1>
    )
}