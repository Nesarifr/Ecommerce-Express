import Express  from "express";
import { Productos } from "../src/module/Productos.js";

/* ------------------------ configuracion del routerProducts ------------------------ */
const routerProducts = Express.Router();
const newProduct= new Productos('Productos.txt');

routerProducts.use(Express.json());
routerProducts.use(Express.urlencoded({extended: true}))
/* ------------------------------ GET: '/:id?' ------------------------------ */
// Me permite listar todos los productos disponibles ó un producto por su id 
/* -------------- (disponible para usuarios y administradores) -------------- */

routerProducts.get('/', async (req, res)=> {
    try{
        console.log(`Se hizo ruta get / para usuario y administrador`);
        const productos = await newProduct.getAll()
        if ( productos){
            res.render('home', {productos} )
            // res.json(productos)
        } else res.render('partials/error', {productos: {error: 'No existe una lista de productos todavia'}})
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})

routerProducts.get('/:id', async (req, res, next)=>{
    try{
        const {id} = req.params
        const existeProducto = await newProduct.getById(id)
        if(existeProducto){
            res.json(await newProduct.getById(parseInt(id)))
        } else res.json({error: 'No existe el archivo solicitado'})
    }
    catch(error){
        res.status(500).send('Error en el servidor')
    }
})

/* -------------------------------- POST: '/' ------------------------------- */
/* ------------------ Para incorporar productos al listado ------------------ */
/* -------------------- (disponible para administradores) ------------------- */

const esAdmin = (req, res, next) =>{
    console.log(req.headers.authorization);
    if(req.headers.authorization !== "true"){
        res.json({ error : '-1', descripcion: `ruta ${req.headers.referer} método ${req.method} no autorizada`})
    }    
    else{next()}
}

routerProducts.post('/', esAdmin, async (req, res)=> {
    try{
        console.log("Se crea nuevo producto con POST / con verificacion de administrador");
        const loadProduct = req.body
        const nuevoId = await newProduct.save(loadProduct)
        res.json({
            id: nuevoId,
            nuevoProducto: loadProduct
        })
    }catch(error){
        res.status(500).send('Error en el servidor')
    }    
})

/* ------------------------------- PUT: '/:id' ------------------------------ */
/* --------------------- Actualiza un producto por su id -------------------- */
/* -------------------- (disponible para administradores) ------------------- */


routerProducts.put('/:id', esAdmin, async (req, res)=>{
    try{
        console.log("se modifica el producto con PUT /:id con verificacion de  Admin");
        const {id} = req.params
        const upDate = req.body
        const actualizacion = await newProduct.actualizaByID(parseInt(id), upDate)
        if(actualizacion){
            res.json(actualizacion)
        } else res.json({error: "No se pudo actualizar el producto solicitado"}) 
    }
    catch{
        res.status(500).send('Error en el servidor')
    }
})

/* ----------------------------- DELETE: '/:id' ----------------------------- */
/* ----------------------- Borra un producto por su id ---------------------- */
/* -------------------- (disponible para administradores) ------------------- */

routerProducts.delete('/:id', esAdmin, async (req, res)=>{
    try{
        console.log("se realiza un DELETE /:id con verificacion de admin");
        const {id} = req.params
        const productoID=await newProduct.getById(id)
        if(productoID){ //getById devuelve null en caso de que no exita el elemento con ID
            await newProduct.deletedById(parseInt(id))
            res.json({msg: "Producto eliminado"})
        } else {res.json({msg: "El producto no existe"})}
    }
    catch{
        res.status(500).send('Error en el servidor')
    }
    
})

export default routerProducts;