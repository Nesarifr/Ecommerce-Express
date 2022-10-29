import express  from "express";
import * as HttpServer from 'http';
import * as IoServer from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import routerProducts  from "./router/productos.js";
import routerCarrito from "./router/carrito.js";
import { engine } from 'express-handlebars';
/* ------------------- constantes necesarias del servidor ------------------- */
const app = express();
const httpServer = new HttpServer.createServer(app); 
//io: servidor de Websocket
const io = new IoServer.Server(httpServer); //conectamos con el servidor principal Http
const __filename = fileURLToPath(import.meta.url); 
// ^^^ Esta es una variable especial que contiene toda la meta información relativa al módulo, de forma que podremos acceder al contexto del módulo.
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 8080;

/* ------------------- rutas /api/productos y api/carrito ------------------- */
app.use('/api/productos', routerProducts );
app.use('/api/carrito', routerCarrito);

/* ------------------------------- configuracion del servidor ------------------------------- */
app.use(express.static(__dirname + '/public')) 
app.use(express.json());
app.use(express.urlencoded({extended: true}))

/* ---------------------- definicion motor de plantilla --------------------- */
app.engine('hbs', engine({extname: 'hbs'}))
app.set('views', __dirname+'/public/views') //ubicacion de templates
app.set('view engine', 'hbs') // definitar motor para express

/* -------------------- Se crea el servidor y se enciende ------------------- */
httpServer.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));