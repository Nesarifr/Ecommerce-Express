window.addEventListener('load', function () {

let autorizacionAdminitrador

const contenedorPrincipal = document.querySelector('.contenedor-varios')
const administradores = document.querySelector('.administrador')
const carrito = document.querySelector('.carrito')
const compraProducto= document.querySelectorAll('.compra-producto')
let nuevoCarrito 

administradores.addEventListener('click', (e)=>{
    e.preventDefault()
    Swal.fire({
        title:"¿Es Administrador?",
        icon: 'info',
        html:"no mienta por favoh ",
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> si, soy',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i> ups, nop',
    }).then(respuesta=>{
        user = respuesta.value;
        if(user){
            autorizacionAdminitrador = user
            serAdministrador()
        }
    });
})

carrito.addEventListener('click', (e)=>{
    e.preventDefault()
    fetch('../views/partials/carrito.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlCarrito = template ()
        console.log(htmlCarrito);
        contenedorPrincipal.innerHTML = htmlCarrito
    })
})

compraProducto.forEach(card=>{
    card.addEventListener('click', async (e)=>{
        e.preventDefault()
        let idProducto = card.parentElement.parentElement.querySelector('#idProducto').innerText
        if(!nuevoCarrito){
            console.log("se ingresa aca");
            nuevoCarrito = await nuevoCarritoid();
            console.log(nuevoCarrito);
            await agregarProdAlCarrito(nuevoCarrito, idProducto)
        } else{
            await agregarProdAlCarrito(nuevoCarrito, idProducto)
        }
    })
})


/* ---------------------------- carga de paginas ---------------------------- */
function serAdministrador() {
    fetch('../views/partials/administrador.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{
        derivarPaginaAdministrador()
        })
}

function cargaDeProductos() {
    fetch('../views/partials/cargaProductos.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{enviarProducto()})
    
};

function paginaBuscarProducto() {
    fetch('../views/partials/buscarProducto.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{
        searchProduct()
        })
    
}

function mostrarError(error){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        
    })
}

function paginaModifProducto(){
    fetch('../views/partials/modifProducto.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{modifProducto()})
    
}

function paginaDeleteProductos(){
    fetch('../views/partials/paginaDelete.hbs',
    {
        method: 'GET',
        headers:{
            'authorization': autorizacionAdminitrador,
            'Content-Type': 'application/json'
        }
    })
    .then(resp =>resp.text())
    .then(form =>{
        const template = Handlebars.compile(form)
        const htmlformProductos = template ()
        contenedorPrincipal.innerHTML = htmlformProductos
    })
    .then(()=>{deleteProduct()})
    
}
/* -------------------------------- acciones productos -------------------------------- */

let enviarProducto = ()=> {
    const newProduct = document.querySelector('#newProduct')
    console.log(newProduct);
    newProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const product = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            codigo: codigo.value,
            foto: foto.value,
            precio: precio.value,
            stock: stock.value
        }

        const url = './productos'
        const configuraciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            },
            body: JSON.stringify(product)
        }
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            console.log(data);
        })
        newProduct.reset()
    })
}

let searchProduct= ()=>{
    const formSearchProduct=document.querySelector('#searchProduct')
    console.log(formSearchProduct);
    formSearchProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const url = `./productos/${id.value}`
        const configuraciones = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            }
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            if(data.error){
                mostrarError(data.error)
            }
            const htmlProductos = 
            `<div class="card-productos">
                <div class="imagen">
                    <img src=${data.foto} alt="">
                </div>
                <h2>${data.nombre}</h2>
                <p> <small>id: ${data.id} codigo: ${data.codigo}</small></p>
                <p>${data.descripcion}</p>
                <div class="comprar">
                    <p>Stock: ${data.stock}</p>
                    <p>$ ${data.precio}</p>
                    <a href="/carrito"><button>Comprar</button></a>
                </div>
            </div>`
            contenedorPrincipal.innerHTML+= htmlProductos
        })
        formSearchProduct.reset()
    })
}

let modifProducto= ()=>{
    const modifProduct=document.querySelector('#modifProduct')
    console.log(modifProduct);
    modifProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const url = `./productos/${id.value}`
        const product = {
            nombre: nombre.value,
            descripcion: descripcion.value,
            codigo: codigo.value,
            foto: foto.value,
            precio: precio.value,
            stock: stock.value
        }
        const configuraciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            },
            body: JSON.stringify(product)
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            if(data.error){
                mostrarError(data.error)
            }
            const htmlProductos = 
            `<div class="card-productos">
                <div class="imagen">
                    <img src=${data.foto} alt="">
                </div>
                <h2>${data.nombre}</h2>
                <p> <small>id: ${data.id} codigo: ${data.codigo}</small></p>
                <p>${data.descripcion}</p>
                <div class="comprar">
                    <p>Stock: ${data.stock}</p>
                    <p>$ ${data.precio}</p>
                    <a href="/carrito"><button>Comprar</button></a>
                </div>
            </div>`
            contenedorPrincipal.innerHTML+= htmlProductos
            
        })
        modifProduct.reset()
    })

}

let deleteProduct=()=>{
    const formDeleteProduct=document.querySelector('#deleteProduct')
    formDeleteProduct.addEventListener('submit', event =>{
        event.preventDefault()
        const url = `./productos/${id.value}`
        const configuraciones = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': autorizacionAdminitrador
            }
        }
        contenedorPrincipal.innerHTML=""
        fetch(url,configuraciones )
        .then(resp => resp.json())
        .then(data=>{
            console.log(data);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.msg,
                
            })
        })
        formDeleteProduct.reset()
    })
}

let derivarPaginaAdministrador = () =>{
    const buscarProducto = document.querySelector('.buscarProduct')
    const nuevoProducto = document.querySelector('.nuevoProducto')
    const modificarProducto = document.querySelector('.modificarProducto')
    const borrarProduct = document.querySelector('.borrarProduct')

    buscarProducto.addEventListener('click', event =>{
        event.preventDefault()
        paginaBuscarProducto()
    })
    nuevoProducto.addEventListener('click', (event)=>{
        event.preventDefault()
        cargaDeProductos()
    })
    modificarProducto.addEventListener('click',(event)=>{
        event.preventDefault()
        paginaModifProducto()
    })

    borrarProduct.addEventListener('click',(event)=>{
        event.preventDefault()
        paginaDeleteProductos()})
}
/* --------------------------- acciones de carrito -------------------------- */

async function nuevoCarritoid(){
    const url = '/api/carrito'
    const configuraciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch(url, configuraciones)
    .then(resp => 
        console.log(resp.json()))
    .then(data=> {
        console.log(data)})
    
    return response
}

async function agregarProdAlCarrito(nuevoCarrito, idProducto){
    
    const urlProducto = `./productos/${idProducto}`
    const urlCarrito = `./carrito/${nuevoCarrito}/productos/`

    const configuracionesProducto = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(urlProducto, configuracionesProducto )
    .then(response => response.json())
    .then(data=>{
        console.log(data);
        let configuracionCarrito
        return configuracionCarrito = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data, null, " ")
        }})
    .then(produc=>{
        console.log(urlCarrito);
            fetch(urlCarrito, produc)
                .then(resp => resp.json())
                .then(data=>{
                    console.log(data);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.msg,  
    })})})
}


})