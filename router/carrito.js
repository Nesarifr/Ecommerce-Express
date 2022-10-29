import Express  from "express";
import { Carrito } from "../src/module/carrito.js";


/* ------------------------ configuracion del router ------------------------ */
const routerCarrito = Express.Router();
const newCarrito= new Carrito('carrito.txt');

routerCarrito.use(Express.json());
routerCarrito.use(Express.urlencoded({extended: true}))

/* -------------------------------- POST: '/' ------------------------------- */
/* -------------------- Crea un carrito y devuelve su id. ------------------- */
routerCarrito.post('/', async (req, res)=>{
    try{
        const nuevoId = await newCarrito.save([]);
        res.json({
            nuevoid: nuevoId
        }) 
    }catch{
        res.status(500).send('Error en el servidor')
    }
})

/* ----------------------------- DELETE: '/:id' ----------------------------- */
/* --------------------- Vacía un carrito y lo elimina. --------------------- */
routerCarrito.delete('/:id', async (req,res)=>{
    try{
        const {id}=req.params;
        const carritoID = await newCarrito.getById(id);
        if(carritoID){
            await newCarrito.deletedById(parseInt(id));
            res.json({msg: "Carrito eliminado"})
        } else {res.json ({msj: "Carrito no existe"})}
    }catch{
        res.status(500).send('Error en el servidor')
    }
})

/* -------------------------- GET: '/:id/productos' ------------------------- */
/* ------ Me permite listar todos los productos guardados en el carrito ----- */
routerCarrito.get('/:id', async (req , res)=>{
    try{
        const {id}=req.params;
        const existeCarrito = await newCarrito.getById(id)
        if(existeCarrito){
            res.json(await newCarrito.getById(parseInt(id)))
        } else res.json({error: "No existe el carrito solicitado."})

    }catch{
        res.status(500).send('Error en el servidor')
    }
})

/* ------------------------- POST: '/:id/productos' ------------------------- */
/* ------- Para incorporar productos al carrito por su id de producto ------- */
routerCarrito.post('/:id/productos', async (req, res)=> {
    try{
        const loadProduct = req.body;
        const {id} = req.params
        console.log(loadProduct, id);
        const existeCarrito = await newCarrito.getById(id)
        if(existeCarrito){
            const carritos = await newCarrito.getAll()
            const arrayActualizada = carritos.map(carrito =>{
                if(carrito.id===id){
                    return carrito.push(loadProduct)
                } else return carrito
            })
            return arrayActualizada;
        }else res.json({error: "No existe el carrito solicitado."})
    }catch(error){
        res.status(500).send('Error en el servidor')
    }    
})


/* -------------------- DELETE: '/:id/productos/:id_prod' ------------------- */
/* --- Eliminar un producto del carrito por su id de carrito y de producto -- */
routerCarrito.delete('/:id/productos/:id_prod', async (req, res)=>{
    try{
        const {id_prod, id} = req.params;
        const existeCarrito = await newCarrito.getById(id)
        if(existeCarrito){
            const existeProducto  = await existeCarrito.getById(id_prod)
            if(existeProducto){
                const carritos = await newCarrito.getAll()
                const arrayActualizada = carritos.map(carrito =>{
                    if(carrito.id===id){
                        carrito.filter(producto => producto.id!==id_prod)
                    } else return carrito
                })
            }else res.json({error: "No existe el producto solicitado."})
        }else res.json({error: "No existe el carrito solicitado."})
    }catch(error){
        res.status(500).send('Error en el servidor')
    }    
})

export default routerCarrito