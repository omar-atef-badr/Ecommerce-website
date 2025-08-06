import express from 'express';
import fs from 'node:fs';
let app = express();
import { randomUUID } from "node:crypto";
import { loadProducts, saveProducts } from "./src/products_lst.js";
import { loadSellers, saveSellers } from "./src/seller_lst.js";
import path from 'node:path';
let thisproducts = await loadProducts("products_info.json");
let thissellers = await loadSellers("sellers_info.json");
app.use(express.json());
app.use(express.static('src'));
/*app.use(express.static(path.join(import.meta.dirname, 'src')));*/

/*
//Serve index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, './src/index.html'));
});
*/

//GET - api/v1/products/
app.get('/api/v1/products', async (req, res) => {
    let thisproducts = await loadProducts("products_info.json");
    const productz = Array.from(thisproducts.values());
    const productss = productz.map((product) => ({ id: product.id, title: product.title, image_url:product.image_url, price: product.price, rating: product.rating}));
    res.status(200).json({
        status: "success",
        count: thisproducts.size,
        data: {
            products: productss
        }
    });
});

//GET - api/v1/sellers/
app.get('/api/v1/sellers', async (req, res) => {
    let thissellers = await loadSellers("sellers_info.json");
    res.status(200).json({
        status: "success",
        count: thissellers.size,
        data: {
            sellers: Array.from(thissellers.values())
        }
    });
});

//POST - api/v1/products/
app.post('/api/v1/products', (req, res) => {
    const newID = randomUUID();
    const newProduct = { id: newID, ...req.body };
    thisproducts.set(newID,newProduct);
    saveProducts("products_info.json", thisproducts);
    res.status(201).json({
        status: "success",
        data: {
            product: newProduct
        }
    });
});

//GET - api/v1/products/:id
app.get('/api/v1/products/:id', (req, res) => {
    const product = thisproducts.get(req.params.id);
    if (product) {
        res.status(200).json({
            status: "success",
            data: {
                product: product
            }
        });
    } else {
        res.status(404).json({
            status: "fail",
            message: "Product not found"
        });
    }
});

//GET - api/v1/sellers/:id
app.get('/api/v1/sellers/:id', (req, res) => {
    const sellerId = req.params.id;
    const productsArray = Array.from(thisproducts.values());
    const sellerProducts = productsArray.filter(product => product.seller_id === sellerId).map((product) => ({ id: product.id, title: product.title, image_url:product.image_url, price: product.price, rating: product.rating}));
    const sellerDetails = thissellers.get(sellerId);

    if (sellerDetails) {
        res.status(200).json({
            status: "success",
            count: sellerProducts.length,
            data: {
                ...sellerDetails,
                products: sellerProducts
            }
        });
    } else {
        res.status(404).json({
            status: "fail",
            message: "Seller not found"
        });
    }

});

//PATCH - api/v1/products/:id/buy
app.patch('/api/v1/products/:id/buy', (req, res) => {
    const product = thisproducts.get(req.params.id);
    const requestedQuantity = req.body.quantity || 1; //default quantity = 1
    if (product) {
        if (product.stock_count >= requestedQuantity) {
            product.stock_count -= requestedQuantity;
            saveProducts("products_info.json", thisproducts);
            res.status(200).json({
                status: "success",
                data: {
                    product: product
                }
            });
        } else if (product.stock_count > 0) {
            res.status(400).json({
                status: "fail",
                message: `Only ${product.stock_count} shirts available in stock`
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: "Product out of stock"
            });
        }
    } else {
        res.status(404).json({
            status: "fail",
            message: "Product not found"
        });
    }
});

export default app;
/*
import express from 'express';
import fs from 'fs';
let app = express();
import { randomUUID } from "node:crypto";
import { readFromCacheOrDefault} from "./src/products_lst.js";
import { writeToCache} from "./src/products_lst.js";
import { loadProducts} from "./src/products_lst.js";
import { saveProducts} from "./src/products_lst.js";
let thisproducts = await readFromCacheOrDefault("products_info.json");

app.use(express.json());

//GET - api/v1/products/
app.get('/api/v1/products', (req, res) => {
    res.status(200).json({
        status: "success",
        count: thisproducts.length,
        data: {
            products: thisproducts
        }
    })
});

//POST - api/v1/products/
app.post('/api/v1/products', (req, res) => {
    const newID = randomUUID();
    const newProduct = Object.assign({ id: newID }, req.body);
    thisproducts.push(newProduct);
    writeToCache("products_info.json",thisproducts);
    res.status(201).json({
        status: "success",
        data: {
            product: newProduct
        }
    })
    //res.send('Data received');
});

//GET - api/v1/prodcuts/id
app.get('/api/v1/products/:id', (req, res) => {
    const id = req.params.id;
    let product = thisproducts.find(el => el.id === id);
    
    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found"
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            product: product
        }
    })

});

const port = 1230
app.listen(port, () => {
console.log(`Server listening on port ${port}`)
})
*/