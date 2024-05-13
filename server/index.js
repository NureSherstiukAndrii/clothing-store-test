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
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbService = require("./db");
const {Storage} = require("@google-cloud/storage");
const Console = require("console");
const parentDir = path.resolve(__dirname, '..');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const corsOptions ={
    origin:'http://localhost:3001',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


app.use(cors(corsOptions));
app.use(express.static(path.join(parentDir, '/client')))
app.use(express.json());
app.use(cookieParser());
app.use('/mobileapi', mobileApi);
app.use('/api', router);
app.use('/api/login', router);
app.use('/api/registration', router);
app.use('/', pageRouter)
app.use(errorMiddleware);

const cloudImg = new cloud_img();

// const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5 MB
//     }
// });

const uploadDir = path.join(__dirname, 'images');

const config = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER_DB,
    database: process.env.DATABASE_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
};



// Создание хранилища Multer
const imagesStorage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = Multer({ storage: imagesStorage });



const storageConfig = {
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    }
};

const storage = new Storage(storageConfig);

app.use('/styles', express.static(path.join(parentDir, 'client/styles'), {
    headers: { 'Content-Type': 'text/css' }
}));


app.get('/api/cloud-img', async (req, res) => {
    try {
        const imageName = req.query.filename;
        let localFilePath = path.join(__dirname, 'images', imageName);
        res.sendFile(localFilePath);
        //const url = await cloudImg.getImgUrl(req.query.filename);
        //res.json({ url });
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

app.get("/getProducts/:page", function (request, response) {
    const { page } = request.params;
    const db = dbService.getDbServiceInstance();
    let products = db.getProductsWithOffset(page);
    let images = db.getProductImages();

    let result;
    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p, i);

        response.json({ data: result });
    });
});

app.get("/productsCount", function (request, response) {
    const db = dbService.getDbServiceInstance();
    let count = db.countProducts();
    count.then((data) => response.json({count: data}));
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

app.get("/checkFav", (request, response) => {
    const { user_id, product_id } = request.query;
    const db = dbService.getDbServiceInstance();
    let result = db.checkInFav(user_id, product_id);

    result
        .then((data) => response.json(data))
        .catch((err) => console.log(err));
});

app.get("/getFavorite/:id", (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    let products = db.getAllProductsFromFavorite(id);
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
        result = addImagesToProducts(p, i);
        response.json(result);
    });
});


app.delete("/deleteFromCart_Fav", (request, response) => {
    const { userId, product_id, is_cart } = request.query;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteFromCart_Fav(userId, product_id, +is_cart);

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
    const { name, sex, price, description, type_of_product, size, season, amount, img } = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.addProduct(name, sex, price, description, type_of_product, size, season, amount, img)

    result
        .then((data) => { res.json({ data: data }); })
        .catch((err) => console.log(err));
});

app.post('/insertProductFiles', upload.array('images', 4), (req, res) => {
    console.log(req.files);

    res.json({ message: 'Images uploaded successfully' });

    // const files = req.files;
    // const storageConfig = {
    //     projectId: process.env.PROJECT_ID,
    //     credentials: {
    //         client_email: process.env.CLIENT_EMAIL,
    //         private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    //     }
    // };
    //
    // const storage = new Storage(storageConfig);
    //
    // const bucketName = process.env.BUCKETNAME;
    // const bucket = storage.bucket(bucketName);
    //
    // for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const fileName = file.originalname;
    //     const blob = bucket.file(fileName);
    //     const blobStream = blob.createWriteStream();
    //
    //     blobStream.on('error', err => {
    //         console.error(err);
    //         res.status(500).send({ error: 'Error uploading files to Google Cloud' });
    //     });
    //
    //     blobStream.on('finish', () => {
    //         if (i === files.length - 1) {
    //             res.status(200).send({ message: 'Files uploaded successfully' });
    //         }
    //     });
    //
    //     blobStream.end(file.buffer);
    // }
});


app.delete("/deleteProduct/:id", (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteProduct(id);

    result
        .then((data) => response.json({ success: data }))
        .catch((err) => console.log(err));
});


app.patch("/updateProductJSON", (request, response) => {
    const {productId, name, sex, price, description, type_of_product, size, season, amount, img } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.editProduct(productId, name, sex, price, description, type_of_product, size, season, amount, img)

    result
        .then((data) => { response.json({ data: data }); })
        .catch((err) => console.log(err));
});


app.post('/insertIntoCart_Fav', (req, res) => {
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

app.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    try {
        await sql.connect(config);
        sql.query(`SELECT * FROM Users WHERE e_mail = '${email}'`, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const user = results[0];

                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {

                    const accessToken = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
                    res.json({ accessToken });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/orders', async (req, res) => {
    const { u_id, total_price } = req.body;

    if (!u_id || !total_price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await sql.connect(config);

        const result = await sql.query(`INSERT INTO Orders (u_id, total_price) VALUES (${u_id}, ${total_price}); SELECT SCOPE_IDENTITY() AS orderId;`);

        console.log('Order created successfully');
        return res.status(200).json({ message: 'Order created successfully', orderId: result.recordset[0].orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Error creating order' });
    }
});

app.get('/orders/:u_id', async (req, res) => {
    const { u_id } = req.params;

    try {
        // Подключение к базе данных и выполнение запроса
        await sql.connect(config);
        const result = await sql.query(`SELECT * FROM Orders WHERE u_id = ${u_id}`);

        // Проверка наличия заказов пользователя
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No orders found for the user' });
        }

        // Отправка найденных заказов в формате JSON
        return res.status(200).json({ orders: result.recordset });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Error fetching orders' });
    }
});
app.post('/orders/:order_num/items', async (req, res) => {
    const { order_num } = req.params;
    const { p_id } = req.body;

    if (!order_num || !p_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await sql.connect(config);

        const result = await sql.query(`INSERT INTO Ordered_items (order_num, p_id) VALUES (${order_num}, ${p_id});`);

        console.log('Item added to order successfully');
        return res.status(200).json({ message: 'Item added to order successfully' });
    } catch (error) {
        console.error('Error adding item to order:', error);
        return res.status(500).json({ error: 'Error adding item to order' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listen at port ${PORT} : ${new Date().toLocaleString()}`);
});