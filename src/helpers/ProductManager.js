import fs from 'fs'


class ProductManager{

    constructor (){
        this.path='./src/datastorage/products.json'
    }
    getProducts= ()=>{
        const productsList = JSON.parse(fs.readFileSync(this.path, "utf-8"))
        return(productsList);
    }
    generateRandomString = () =>{
        const charsAvaible="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let string = "";
        for (let i = 0; i < 6; i++) {
            string += charsAvaible.charAt(Math.floor(Math.random() * charsAvaible.length));
        }
        return string;
    }
    generateId= ()=>{
        let list= this.getProducts()
        if(list.length === 0) return 1
        return list[list.length-1].id +1
    }

    validateCode= ()=>{
        const list= this.getProducts()
        let code;
        let auxCode;
        do {
            code = this.generateRandomString()
            auxCode= list.find(x => x.code == code )
        } while(auxCode != undefined)

        return code
    }

    addProducts=({title, description, price, category,  thumbnail, stock}) =>{
            let list= this.getProducts()
            const id= this.generateId()
            const code = this.validateCode()
            thumbnail ? thumbnail : thumbnail="empty"
            const product={id, title, description, price ,status:true ,category, thumbnail, code, stock}
            list.push(product)
            fs.writeFileSync(this.path, JSON.stringify(list, null))
            console.log(`producto con id ${id} creado`)
    }

    getProductsById= (id)=>{
        
        try {
            const list= this.getProducts()
            const found= list.find(product => product.id == id)

            if(found) return found
            return (`No hay productos con el id ${id}`)

        } catch (error) {
            console.log(error)
        }
    }

    updateProduct= (id, data)=>{
        
            let list= this.getProducts()
            const pIndex= list.findIndex(p => p.id == id)
            const original = this.getProductsById(id)
            
            if(original.id == id ){
                
                if(pIndex != -1){
                    list[pIndex]={...list[pIndex], ...data}
                    
                    fs.writeFileSync(this.path, JSON.stringify(list, null, 2)) 
                    console.log(`Producto con el ${id} actualizado`)
                }else{
                    console.log(`No hay ningun producto con el id ${id}`)
                }
            }else{
                console.log("No se puede modificar id o code")
            }
    }

    deleteProduct =(id) => {      
        try {
            const PTDelete=  this.getProductsById(id)
            let list= this.getProducts()
            if (!PTDelete) { 
                console.log("id no encontrado")
            }
            list = list.filter(prod => prod.id != PTDelete.id) 
            fs.writeFileSync(this.path, JSON.stringify(list, null, 2)) 
            console.log(`producto con id ${id} eliminado`)
        } catch (error) {
            console.log(error)
        }
    }
}

export default ProductManager
