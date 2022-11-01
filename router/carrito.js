import Express  from "express";
import { Carrito } from "../src/module/Carrito.js";


/* ------------------------ configuracion del router ------------------------ */
const routerCarrito = Express.Router();
const newCarrito= new Carrito('carrito.txt');

routerCarrito.use(Express.json());
routerCarrito.use(Express.urlencoded({extended: true}))

/* -------------------------------- POST: '/' ------------------------------- */
/* -------------------- Crea un carrito y devuelve su id. ------------------- */
routerCarrito.post('/', async (req, res)=>{
    try{
        console.log("ingresa al metodo post /");
        const nuevoId = await newCarrito.save();
        res.json({nuevoid: nuevoId}) 
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
// routerCarrito.get('/:id', async (req , res)=>{
//     try{
//         const {id}=req.params;
//         const existeCarrito = await newCarrito.getById(id)
//         if(existeCarrito){
//             res.json(await newCarrito.getById(parseInt(id)))
//         } else res.json({error: "No existe el carrito solicitado."})

//     }catch{
//         res.status(500).send('Error en el servidor')
//     }
// })

/* ------------------------- POST: '/:id/productos' ------------------------- */
/* ------- Para incorporar productos al carrito por su id de producto ------- */
routerCarrito.post('/:id/productos', async (req, res)=> {
    try{
        const loadProduct = req.body;
        const {id} = req.params
        const existeCarrito = await newCarrito.getById(id)
        if(existeCarrito){
            const carritos = await newCarrito.getAll()
            const [nuevoProducto] = loadProduct
            const arrayActualizada = carritos.map(carrito =>{
                if(carrito.id==id){
                        if(!carrito.product){
                            carrito.product = []
                            carrito.product.push(nuevoProducto)
                        } else{
                            carrito.product.push(nuevoProducto)
                        }
                    return carrito
                } else {return carrito}
            })
            const nuevaLista = await newCarrito.saveAllCarritos(arrayActualizada)
            res.json(nuevaLista)
        }else res.json({error: "No existe el carrito solicitado."})
    }catch(error){
        res.status(500).send('Error en el servidor')
    }    
})


/* -------------------- DELETE: '/:id/productos/:id_prod' ------------------- */
/* --- Eliminar un producto del carrito por su id de carrito y de producto -- */
routerCarrito.delete('/:id/productos/:id_prod/', async (req, res)=>{
    try{
        const  id = req.params.id;
        const  id_prod= req.params.id_prod;
        const existeCarrito = await newCarrito.getById(id)
        if(existeCarrito){
            if(existeCarrito.product){
                const carritoActualizado = existeCarrito.product
                const arrayActualizada = carritoActualizado.filter(product =>product.id!=id_prod)
                
                const allCarritos = await newCarrito.getAll();

                const allNewCarritos = allCarritos.map(carrito =>{
                    if(carrito.id==id){
                        carrito.product=[...arrayActualizada]
                        return carrito
                    } else{ return carrito}
                })

                await newCarrito.saveAllCarritos(allNewCarritos)
                const carritoModificado = await newCarrito.getById(id)
                res.json(carritoModificado)
            }else res.json({error: "No existe el producto solicitado."})
        }else res.json({error: "No existe el carrito solicitado."})
    }catch(error){
        res.status(500).send('Error en el servidor')
    }    
})

routerCarrito.get('/:id/productos/', async (req, res)=> {
    try{
        const {id} = req.params
        const carrito = await newCarrito.getById(id)
        if ( carrito ){
            res.json(carrito)
            // res.json(productos)
        } else res.render('partials/error', {productos: {error: 'No existe una lista de productos todavia'}})
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})


export default routerCarrito