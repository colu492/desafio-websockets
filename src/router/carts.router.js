import { Router } from "express";
import cartManager from '../helpers/CartManager.js'

const router= Router()
const manager= new cartManager()

router.post('/', (req, res)=>{
    manager.createCart()
    res.status(201).send("Nuevo carrito creado")
})
router.get('/:cid', (req,res)=>{
    const cid= req.params.cid
    const list = manager.getProductsFromACart(cid)
    if(list == false){
        res.send(`El carro ${cid} no existe`)
    }else{
        res.send(list)
    }
})
router.post('/:cid/products/:pid', (req, res)=>{
    const cid= req.params.cid
    const pid= req.params.pid
    manager.addProductToCart(cid,pid)
    res.status(201).send(`producto ${pid} añadido al carrito ${cid}`)

})
export default router