const express = require("express");
const app = express();
const path = require('path')

const dbService = require("./db");

const parentDir = path.resolve(__dirname, '..');

app.use('/styles', express.static(path.join(parentDir, 'client/styles'), {
    headers: { 'Content-Type': 'text/css' }
}));


app.use(express.static(path.join(parentDir, '/client')))
app.use(express.json());


app.get("/", function (req, res){
    res.sendFile( parentDir + "/client/HomePage/index.html");
})

app.get("/about", function (req, res){
    res.sendFile(parentDir + "/client/AboutUsPage/index.html");
})

app.get("/shop", function (req, res){
    res.sendFile(parentDir + "/client/ShopPage/index.html");
})


app.get("/getAllProducts", function(request, response){
    const db = dbService.getDbServiceInstance();
    let products = db.getAllProducts();
    let images = db.getProductImages();

    let result;

    Promise.all([products, images]).then(([p, i]) => {
       result = addImagesToProducts(p, i);

       response.json({data: result});
    });

    //let result = addImagesToProducts(p, i);
    //console.log(result);
    //response.json(result);
    /*let productsJson;
    let imagesJson;

    products
        .then((data) => productsJson = JSON.stringify(data));

    images
        .then((data) => imagesJson = JSON.stringify(data));
    Promise.all([products, images]).then(values => {
        const productsData = values[0];
        const imagesData = values[1];

        productsJson = JSON.stringify(productsData);
        imagesJson = JSON.stringify(imagesData);
    });

    let result = addImagesToProducts(productsJson, imagesJson);

    response.json(result);*/
});

app.get("/getImages", function(request, response){
    const db = dbService.getDbServiceInstance();
    let result = db.getAllProducts();

    result
        .then((data) => response.json({ data: data }))
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



//
// app.post('/insertTour', (req, res) => {
//     const {id, name} = req.body;
//     const db = dbService.getDbServiceInstance()
//
//     const result = db.addTour(+id, name)
//
//     result
//         .then((data) => {res.json({ data: data }); console.log(data)})
//         .catch((err) => console.log(err));
// });
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