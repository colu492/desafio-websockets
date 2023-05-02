import { Router } from "express";
import ProductManager from "../helpers/ProductManager.js";
import { socket } from '../public/js/realTimeProducts.js';
import { io } from '../app.js';

const router = Router()
const manager= new ProductManager()


router.get('/',(req, res)=>{

    const limit = req.query.limit
    let list= manager.getProducts()
    if(limit) {
        list = list.slice(0, limit)
    } 
    res.send(list)
} );

router.get('/:pid', (req, res)=>{
    const pid= req.params.pid
    const identified= manager.getProductsById(+pid)
    res.send(identified)
});

router.get('/', (req, res) => {
    const productHtml = products.map((product) => realTimeProductsView(product)).join('/n');
    res.send(productHtml);
});

router.get('realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
})

router.post('/websocket/product', (req, res) => {
    const newProductWs = new ProductManager({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    });
    productList.addProduct( newProduct );
    socket.emit('productCreated', newProductWs);
    res.send('Producto creado satisfactoriamente');
});

router.post('/', (req, res)=>{
    const { title, description, price, category, thumbnail, stock} = req.body;
    const newProduct = ProductManager.addProducts({title, description, price, category, thumbnail, stock});
    io.emit('newProduct', newProduct);
    res.status(201).send(`Producto ${newProduct.id} agregado.`);
});

router.put('/:pid', (req, res)=>{
    const pid = req.params.pid
    const data= req.body
    manager.updateProduct(pid, data)
    res.status(202).send("Producto actualizado")
});

router.delete('/:pid', (req, res)=>{
    const pid= req.params.pid;
    manager.deleteProduct(pid);
    io.emit('productDeleted', id);
    res.send("Producto eliminado");
});
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    
        req.app.get('io').emit('deleteProduct', productId);
    
        res.status(200).json({ message: 'Deleting product...' });
    });
export default router;