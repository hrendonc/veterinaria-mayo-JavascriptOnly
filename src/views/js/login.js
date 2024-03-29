const form = document.querySelector('form')
const message = document.getElementById('message') 

if(message.innerHTML != ''){
    message.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>${message.innerHTML}</strong>
                <button type="button" id="btnAlert" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
}

// Escuchar el envio de datos del formulario y guardarlos en un objeto

form.addEventListener('submit', e=>{
    e.preventDefault()
    let data = Object.fromEntries(
        new FormData(e.target)
    )
    
    login(data)
})

async function login (data){
    console.log(data)
    const res = await fetch('/auth/signin', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const myData = await res.json()

    if (!res.ok) {
        message.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Error de autenticación!</strong><hr> ${myData.error}
                <button type="button" id="btnAlert" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
        return
    }
        
    window.location.assign("/carrito")
}