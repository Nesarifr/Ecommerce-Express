import fs from 'fs';

class Productos{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        this.url=`./src/module/${this.nombreArchivo}` 
    }
    
    // save(Object): Number - Recibe un producto, lo guarda en el archivo, devuelve el id asignado.
    async save(productoNuevo){ 
        try{
            if(fs.existsSync(this.url)){ //si es que existe el archivo ====>>>
                const listaProductos = await fs.promises.readFile(this.url,"utf-8")
                if(listaProductos){ //si hay contendio en el archivo
                    const arrayProducts = JSON.parse(listaProductos)
                    const ultimoID=arrayProducts.reduce((acc,item)=> item.id> acc ? acc=item.id : acc, 0)
                    const nuevaListaProducts={ ...productoNuevo, id:ultimoID+1}
                    arrayProducts.push(nuevaListaProducts)
                    await fs.promises.writeFile(this.url, JSON.stringify(arrayProducts, null, 2))
                    return nuevaListaProducts.id  //retorno el ID solicitado
                }else{// no hay contenido
                    const nuevaListaProducts={ ...productoNuevo, id:1}
                    await fs.promises.writeFile(this.url, JSON.stringify(nuevaListaProducts, null, 2))
                    return nuevaListaProducts.id  //retorno el ID solicitado
                }
            }else{ //no existe el archivo , por lo tanto es el primer elemento
                const nuevaListaProducts={ ...productoNuevo, id:1}
                await fs.promises.writeFile(this.url, JSON.stringify([nuevaListaProducts], null, 2))
                return nuevaListaProducts.id  //retorno el ID solicitado
            } 
        } catch(err) {
            console.log(err)
        }
    }

    // getById(Number): Product -  Recibe un id y devuelve el producto con ese id, o null si no está.
    async getById(ID){
        try{
            const numeroID=parseInt(ID)
            if(fs.existsSync(this.url)){
                const listaProductos = await fs.promises.readFile(this.url,"utf-8")
                if(listaProductos){ //si hay contendio en el archivo
                    const arrayProducts = JSON.parse(listaProductos)//obtengo todos los elementos del array del archivo
                    const productFind = arrayProducts.find(({id})=>id==numeroID)
                    if(productFind){
                        return productFind
                    }else return null
                } else return null
            } else return null
        }
        catch(err){
            return `No existe el ID ${numeroID} solicitado o ya fue borrado`
        }
    }

    // getAll(): arrayProducts[] - Devuelve un array con los objetos presentes en el archivo. En caso de que no haya objetos, ret
    async getAll(){
        try {
            const listaProductos = await fs.promises.readFile(this.url,"utf8");
            if(listaProductos){
                const arrayProducts = JSON.parse(listaProductos);
                return arrayProducts
            } else{
                return {error: 'No existe una lista de productos todavia'}
            }
        } catch (error) {
            return {error: 'No existe una lista de productos todavia'}
        }
    }

    // deleteById(Number): void - Elimina del archivo el producto con el id buscado.
    async deletedById(ID){
        try {
            const listaProductos = await fs.promises.readFile(this.url,"utf8");
            const arrayProducts = JSON.parse(listaProductos);
            const arrayFiltrados= arrayProducts.filter(item=>item.id!==ID);
            await fs.promises.writeFile(this.url, JSON.stringify(arrayFiltrados, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    // deleteAll(): void - Elimina todos los productos presentes en el archivo.
    async deleteAll(){
        try {
            await fs.promises.writeFile(this.url, JSON.stringify([]));
        } catch (error) {
            console.log(error)
        }
    }

    // acutalizaByID(number: ID , json: productoNew): void - actualiza borrando el producto y agregando el nuevo producto
    async actualizaByID(ID, newProduct){
        try{
            const existeProducto=await this.getById(ID)
            if(existeProducto){
                const arrayProducts= await this.getAll()
                let arrayActualizada = []
                if(arrayProducts){
                    arrayActualizada = arrayProducts.map( obj =>{
                        if(obj.id===ID){
                            return {...newProduct, id: ID}
                        } else return obj
                })} else return null
                await this.deleteAll()
                await fs.promises.writeFile(this.url, JSON.stringify(arrayActualizada, null, 2))
                return {...newProduct, id: ID}
            }
        } catch(error) {
            console.log(error)
        }
    }
}

/* --------------------------------- exports -------------------------------- */
export {Productos}