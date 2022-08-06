const items = document.getElementById('items')
const templateProductos = document.getElementById('template-productos').content
const templateInputs = document.getElementById('template-inputs').content
const fragment = document.createDocumentFragment()

const form = document.querySelector('form')
const title = document.getElementById('exampleModalLabel')
const message = document.getElementById('message')
const tabla = document.querySelector('table')
const tituloForm = document.getElementById('tituloForm')

document.addEventListener('DOMContentLoaded', ()=>{ 
    pintarInputs()
    pintarProductos()
})
    
// Escuchar el envio de datos del formulario y guardarlos en un objeto
form.addEventListener('submit', e=>{
    e.preventDefault()
    let data = Object.fromEntries(
        new FormData(e.target)
    )

    const btnPri = e.target.childNodes[15].children[0].classList.contains("btn-primary")
    const btnWar = e.target.childNodes[15].children[0].classList.contains("btn-warning")
    
    if (btnPri) {
        addData(data)
    }
    if (btnWar) {
        editDataApi(data)
    }
     
    e.stopPropagation()
})

// Escuchar el evento de acciones y enviarlo a la opción correspondiente
items.addEventListener('click', e =>{
    let editar = e.target.classList.contains('btn-info')
    let editarIco = e.target.classList.contains('bi-pencil')
    let eliminar = e.target.classList.contains('btn-danger')
    let eliminarIco = e.target.classList.contains('bi-trash3')

    if(editar) editData(e.target.dataset.id)
    if(editarIco) editData(e.target.dataset.id)
    if(eliminar) deleteData(e.target.dataset.id)
    if(eliminarIco) deleteData(e.target.dataset.id)

    e.stopPropagation()
})

//**** F U N C I O N E S ****//

async function pintarInputs() {
    try {
        form.innerHTML = ''
        templateInputs.getElementById('codigo')
        templateInputs.getElementById('nombre')
        templateInputs.getElementById('precio')
        templateInputs.getElementById('costo')
        templateInputs.getElementById('stock')
        templateInputs.getElementById('descripcion')

        const clone = templateInputs.cloneNode(true)
        fragment.appendChild(clone)

        form.appendChild(fragment) 
    } catch (error) {
        console.log(error)
    }
    
}

// Consumir Productos de la API y mostrarlos
async function pintarProductos(){
    try {
        const res = await fetch('/productos')
        const data = await res.json()
        const producto = data.message    
        
        items.innerHTML = ''

        for(x in producto){
            templateProductos.querySelector('th').textContent = producto[x].codigo
            templateProductos.querySelectorAll('td')[0].textContent = producto[x].nombre
            templateProductos.querySelector('span').textContent = producto[x].precio      
            templateProductos.querySelectorAll('td')[2].textContent = producto[x].stock  
            templateProductos.querySelector('.btn-info').dataset.id = producto[x]._id
            templateProductos.querySelector('.btn-danger').dataset.id = producto[x]._id       
            templateProductos.querySelector('.bi-pencil').dataset.id = producto[x]._id
            templateProductos.querySelector('.bi-trash3').dataset.id = producto[x]._id
        
            const clone = templateProductos.cloneNode(true)
            fragment.appendChild(clone)
        }

        items.appendChild(fragment)
    }
    catch(e){ console.log(e) }
}

// Función para agregar productos
async function addData (data){
    const res = await fetch('/productos', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const myData = await res.json()

    if (!res.ok) {
        title.innerHTML = `
        <strong>Error!</strong>
            `;
        message.innerHTML = `
        <strong class="alert alert-warning" role="alert">${myData.error}</strong>
            `;
        return
    }

    if(res.ok){
        title.innerHTML = `
        <strong>Producto Agregado!</strong>
            `;
        message.innerHTML = `
            <strong class="alert alert-warning" role="alert">El producto ${myData.body.nombre} ha sido registrado correctamente!</strong>
        `;
        return
    }
}

// Función para Eliminar productos
async function deleteData (data){
    const res = await fetch(`/productos/${data}`, {
        method: "DELETE"
    })
    const myData = await res.json()

    if (!res.ok) {
        title.innerHTML = `
        <strong>Error!</strong>
            `;
        message.innerHTML = `
        <strong class="alert alert-warning" role="alert">${myData.error}</strong>
            `;
        return
    }

    if(res.ok){
        title.innerHTML = `
        <strong>Producto Eliminado!</strong>
            `;
        message.innerHTML = `
            <strong class="alert alert-warning" role="alert">${myData.message}</strong>
        `;
    }
}

// Función para crear el Formulario para Editar productos
function editData (data){
    let findData = {}
    let id
     
    for(let i=1; i<tabla.rows.length; i++){

        id = tabla.rows[i].cells[4].lastElementChild.getAttribute("data-id")
        
        if(id === data){
            findData = {
                codigo: tabla.rows[i].cells[0].innerHTML,
                nombre: tabla.rows[i].cells[1].innerHTML,
                precio: tabla.rows[i].cells[2].lastChild.innerHTML,
                stock: tabla.rows[i].cells[3].innerHTML,
                id: tabla.rows[i].cells[4].lastElementChild.getAttribute("data-id")
            }                     
        break
        }   
    }

    tituloForm.innerHTML = `
                <strong>Actualizar un producto</strong>
            `
    try {
        form.innerHTML = ''
        templateInputs.getElementById('id').setAttribute("value",`${id}`)
        templateInputs.getElementById('codigo').setAttribute("placeholder",`${findData.codigo}`)
        templateInputs.getElementById('nombre').setAttribute("placeholder",`${findData.nombre}`)
        templateInputs.getElementById('precio').setAttribute("placeholder",`${findData.precio}`)
        templateInputs.getElementById('costo').setAttribute("placeholder","")
        templateInputs.getElementById('stock').setAttribute("placeholder",`${findData.stock}`)
        templateInputs.getElementById('descripcion').setAttribute("placeholder","")
        templateInputs.getElementById('descripcion').setAttribute("placeholder","")
        templateInputs.getElementById('btn').setAttribute("placeholder","Actualizar Producto")
        templateInputs.getElementById('btn').setAttribute("class","btn btn-warning btn-lg")

        templateInputs.getElementById('codigo').removeAttribute("required")
        templateInputs.getElementById('nombre').removeAttribute("required")
        templateInputs.getElementById('precio').removeAttribute("required")
        templateInputs.getElementById('costo').removeAttribute("required")
        templateInputs.getElementById('stock').removeAttribute("required")
        templateInputs.getElementById('descripcion').removeAttribute("required")
        templateInputs.getElementById('descripcion').removeAttribute("required")
        templateInputs.getElementById('btn').removeAttribute("required")
        templateInputs.getElementById('btn').removeAttribute("required")

        const clone = templateInputs.cloneNode(true)
        fragment.appendChild(clone)

        form.appendChild(fragment) 
    } catch (error) {
        console.log(error)
    }

}

// Función para Editar productos
async function editDataApi(newData){

    console.log(newData)

    const saveData = {
        codigo: newData.codigo,
        costo: newData.costo,
        descripcion: newData.descripcion,
        nombre: newData.nombre,
        precio: newData.precio,
        stock: newData.stock
    }

    const res = await fetch(`/productos/${newData.id}`, {
        method: "PATCH",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
    })
    const myData = await res.json()

    if (!res.ok) {
        title.innerHTML = `
        <strong>Error!</strong>
            `;
        message.innerHTML = `
        <strong class="alert alert-warning" role="alert">${myData.error}</strong>
            `;
        return
    }

    if(res.ok){
        title.innerHTML = `
        <strong>Tarea realizada!</strong>
            `;
        message.innerHTML = `
            <strong class="alert alert-warning" role="alert">El artículo < ${myData.body.nombre} > se actualizó con exito.</strong>
        `;
        return
    }
}

        

