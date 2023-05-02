import { io } from 'socket.io-client';

const socket = io();

socket.on('connect', () => {
    
    socket.on('newProduct', (product) => {
    
        let item = document.createElement('li');
        item.innerText = product.name + ' - ' + product.price;
        document.getElementById('product-list').appendChild(item);
        });
    
    socket.on('deleteProduct', (productId) => {
    
        let item = document.getElementById(productId);
        if (item) {
            item.parentNode.removeChild(item);
        }
    });
});

export {socket};