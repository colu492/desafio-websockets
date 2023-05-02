import express from 'express'
import expressHandlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productRouter from './router/products.router.js'
import cartRouter from './router/carts.router.js'
import fs from 'fs';

const app= express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('./src/public'));
app.use(express.json());
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
    const products = getProductList();
    res.render('index', {products});
});
app.get('/realtimeproducts', (req, res) => {
    const products = getProductList();
    res.render('realtimeproducts', {products});
});

io.on('connection', (socket) => {
    console.log('usuario conectado');

    socket.on('newProduct', (product) => {
        console.log(`Producto ${JSON.stringify(product)} agregado`);
        io.emit('newProduct', product);
    });

    socket.on('deleteProduct', (productId) => {
        console.log(`Producto ${productId} eliminado`);

        io.emit('deleteProduct', productId);
    });
    socket.on('disconnect', () => {
        console.log('usuario desconectado');
    });
});

server.listen(8080, ()=>console.log("server up"))

function getProductList() {
    const products = JSON.parse(fs.readFileSync('./src/datastorage/products.json', 'utf-8'));
    return products;
}

export { server, io };
