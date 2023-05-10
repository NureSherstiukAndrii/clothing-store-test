const express = require("express");
const app = express();
const path = require('path');
const cloud_img = require("./cloud_img");
const Multer = require('multer');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'dogwood-garden-382315',
    keyFilename: './dogwood-garden-382315-f58b3243e2e9.json',
});
const bucketName = 'nure_bucket';
const bucket = storage.bucket(bucketName);

const dbService = require("./db");

const parentDir = path.resolve(__dirname, '..');

app.use('/styles', express.static(path.join(parentDir, 'client/styles'), {
    headers: { 'Content-Type': 'text/css' }
}));


app.use(express.static(path.join(parentDir, '/client')))
app.use(express.json());

const cloudImg = new cloud_img();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

app.get('/api/cloud-img', async (req, res) => {
    try {
        const url = await cloudImg.getImgUrl(req.query.filename);
        res.json({url});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


app.get("/", function (req, res){
    res.sendFile( parentDir + "/client/HomePage/index.html");
})

app.get("/about", function (req, res){
    res.sendFile(parentDir + "/client/AboutUsPage/index.html");
})

app.get("/shop", function (req, res){
    res.sendFile(parentDir + "/client/ShopPage/index.html");
})

app.get("/contacts", function (req, res){
    res.sendFile(parentDir + "/client/ContactPage/index.html");
})

app.get("/login", function (req, res){
    res.sendFile(parentDir + "/client/LogInPage/index.html");
})

app.get("/registration", function (req, res){
    res.sendFile(parentDir + "/client/RegistrationPage/index.html");
})

app.get("/size", function (req, res){
    res.sendFile(parentDir + "/client/SizeChartPage/index.html");
})

app.get('/products/:id', (req, res) => {
    res.sendFile(parentDir + '/client/ProductPage/product.html');
});

app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const db = dbService.getDbServiceInstance();
    let result = db.getProduct(productId);

    result
        .then((data) => {res.json({ data: data });})
        .catch((err) => console.log(err));
});

app.get("/getAllProducts", function(request, response){
    const db = dbService.getDbServiceInstance();
    let products = db.getAllProducts();
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
       result = addImagesToProducts(p, i);

       response.json({data: result});
    });
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
    const {name, sex, price, description, type_of_product,type,size,rating, season,collection_name, img} = req.body;
    const db = dbService.getDbServiceInstance();

    const result = db.addProduct(name, sex, price, description, type_of_product,type,size,rating, season,collection_name, img)

    result
        .then((data) => {res.json({ data: data });})
        .catch((err) => console.log(err));
});

app.post('/insertNewUser', (req, res) => {
    const {name, mail, password} = req.body;
    const db = dbService.getDbServiceInstance();

    let result = db.insertNewUser(name, mail, password)


    result
        .then((data) => {
            // Успешно добавлено
            res.json({ success: true, message: 'Пользователь успешно добавлен в базу данных.' });
        })
        .catch((error) => {
            // Ошибка добавления пользователя
            if (error.code === '23505') {
                res.status(400).json({ success: false, message: 'Почта уже используется другим пользователем.' });
            } else {
                console.error(error);
                res.status(500).json({ success: false, message: 'Произошла ошибка при добавлении пользователя.' });
            }
        });
});

app.post('/loginUser', (req, res) => {
    const {mail, password} = req.body;
    const db = dbService.getDbServiceInstance();

    let result = db.checkUser(mail, password);

    result
        // .then((data) => console.log(data))
        .then((data) => {res.json({ data: data })})
        .catch((err) => console.log(err));
})

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

app.listen(3000);