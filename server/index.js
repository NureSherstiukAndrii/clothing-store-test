const express = require("express");
const app = express();
const path = require('path');
const cloud_img = require("./cloud_img");
const Multer = require('multer');
const cookieParser = require('cookie-parser');
const router = require('../server/router/authRouter');
const pageRouter = require('../server/router/pageRouter')
const errorMiddleware = require('./middlewares/errorMiddleware')
const validateToken = require("./middlewares/authMiddleware");
const mobileApi = require('./mobile-api')
require('dotenv').config();



const dbService = require("./db");
const dbForCart = require("./dbForCart")
const parentDir = path.resolve(__dirname, '..');

app.use(express.static(path.join(parentDir, '/client')))
app.use(express.json());
app.use(cookieParser());
app.use('/mobileapi', mobileApi);
app.use('/api', router);
app.use('/', pageRouter)
app.use(errorMiddleware);

const cloudImg = new cloud_img();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

app.use('/styles', express.static(path.join(parentDir, 'client/styles'), {
    headers: { 'Content-Type': 'text/css' }
}));


app.get('/api/cloud-img', async (req, res) => {
    try {
        const url = await cloudImg.getImgUrl(req.query.filename);
        res.json({ url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/validate-token', validateToken, (req, res) => {
    res.sendStatus(200);
});

app.get('/person/:id', (req, res) => {
    const userId = req.params.id;
    const db = dbService.getDbServiceInstance();
    let result = db.getUser(userId);

    result
        .then((data) => { res.json({ data: data }); })
        .catch((err) => console.log(err));
});

app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const db = dbService.getDbServiceInstance();

    let product = db.getProduct(productId);
    let images = db.getProductImages();

    Promise.all([product, images]).then(([p, i]) => {
        let result = addImagesToProducts(p, i);
        res.json({ data: result });
    });
});

app.get("/productForNameAndSize", function (request, response) {
    const {name, size} = request.query;
    const db = dbService.getDbServiceInstance();
    let result = db.getProductForNameAndSize(name, size);

    result
        .then((data) => response.json(data))
        .catch((err) => console.log(err));
});

app.get("/getAllProducts", function (request, response) {
    const db = dbService.getDbServiceInstance();
    let products = db.getAllProducts();
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p, i);

        response.json({ data: result });
    });
});

app.get("/getRecentClothes", function (request, response) {
    const db = dbService.getDbServiceInstance();
    let products = db.getRecentClothes();
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p, i);

        response.json({ data: result });
    });
});

app.get("/getTopClothes", function (request, response) {
    const db = dbService.getDbServiceInstance();
    let products = db.getTopClothes();
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p, i);

        response.json({ data: result });
    });
});

app.get("/getCart/:id", function (request, response) {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    let products = db.getAllProductsFromCart(id);
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p.products, i);
        response.json({result , total_price: p.total_price});
    });
});

app.delete("/deleteFromCart", (request, response) => {
    const { userId, product_id } = request.query;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteFromCart_Fav(userId, product_id);

    result
        .then((data) => response.json({ success: data }))
        .catch((err) => console.log(err));
});


function addImagesToProducts(products, images) {
    for (let i = 0; i < products.length; i++) {
        const productImages = [];
        for (let j = 0; j < images.length; j++) {
            if (products[i].Id === images[j].p_id) {
                productImages.push(images[j].img);
            }
        }
        products[i].images = productImages;
    }
    return products;
}

app.post('/insertProductJSON', (req, res) => {
    const { name, sex, price, description, type_of_product, type, size, rating, season, collection_name, img } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.addProduct(name, sex, price, description, type_of_product, type, size, rating, season, collection_name, img)

    result
        .then((data) => { res.json({ data: data }); })
        .catch((err) => console.log(err));
});

app.post('/insertProductFiles', multer.array('images', 4), (req, res) => {
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.originalname;

        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', err => {
            console.error(err);
            res.status(500).send({ error: 'Error uploading files to Google Cloud' });
        });

        blobStream.on('finish', () => {
            if (i === files.length - 1) {
                res.status(200).send({ message: 'Files uploaded successfully' });
            }
        });

        blobStream.end(file.buffer);
    }
});

//
// app.delete("/deleteTour/:id", (request, response) => {
//     const { id } = request.params;
//     const db = dbService.getDbServiceInstance();
//
//     const result = db.deleteTour(id);
//
//     result
//         .then((data) => response.json({ success: data }))
//         .catch((err) => console.log(err));
// });
//
// app.patch("/updateTour", (request, response) => {
//     console.log(request);
//     const {id, name} = request.body;
//     const db = dbService.getDbServiceInstance();
//     const result = db.editTour(+id, name);
//     result
//         .then((data) => response.json({ success: data }))
//         .catch((err) => console.log(err));
// });


app.post('/insertIntoCart', (req, res) => {
    const { userId, productId, is_cart } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.addIntoCart_Fav(userId, productId, is_cart)

    result
        .then((data) => { res.json({ data: data }); })
        .catch((err) => console.log(err));
});

app.post('/insertIntoFav', (req, res) => {
    const { userId, productId, is_cart } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.addIntoCart_Fav(userId, productId, is_cart)

    result
        .then((data) => { res.json({ data: data }); })
        .catch((err) => console.log(err));
});


app.get("/getAllProductsSizeForName", (request, response) => {
    const productName = request.query.product;
    const db = dbService.getDbServiceInstance();
    const result = db.getProductForName(productName);

    result
        .then((data) => response.json(data))
        .catch((err) => console.log(err));
});

// app.delete("/deleteFromCart_Fav/:id", (request, response) => {
//     const { id } = request.params;
//     const db = dbService.getDbServiceInstance();
//
//     const result = db.deleteFromCart_Fav(id);
//
//     result
//         .then((data) => response.json({ success: data }))
//         .catch((err) => console.log(err));
// });


app.get("/applyFilters", (req, res) => {
    const { priceFrom, priceTo, gender, sizes, types, seasons, orderBy } = req.query;
    const db = dbService.getDbServiceInstance();

    const products = db.getProductsWithFilters(gender, sizes, types, seasons, priceFrom, priceTo, orderBy);
    let images = db.getProductImages();


    Promise.all([products, images]).then(([p, i]) => {
        let result = addImagesToProducts(p, i);
        res.json({ data: result });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listen at port ${PORT} : ${new Date().toLocaleString()}`);
});