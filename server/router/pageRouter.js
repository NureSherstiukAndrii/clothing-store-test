const express = require("express");
const path = require("path");
const router = express.Router();

const parentDir = path.resolve(__dirname, '..');

console.log(parentDir);

const trimmedPath = parentDir.substring(0, parentDir.lastIndexOf('\\server'));



router.get("/", function (req, res){
    res.sendFile( trimmedPath + "/client/HomePage/index.html");
})

router.get("/about", function (req, res){
    res.sendFile(trimmedPath + "/client/AboutUsPage/index.html");
})

router.get("/shop", function (req, res){
    res.sendFile(trimmedPath + "/client/ShopPage/index.html");
})

router.get("/contacts", function (req, res){
    res.sendFile(trimmedPath + "/client/ContactPage/index.html");
})

router.get("/login", function (req, res){
    res.sendFile(trimmedPath + "/client/LogInPage/index.html");
})

router.get("/registration", function (req, res){
    res.sendFile(trimmedPath + "/client/RegistrationPage/index.html");
})

router.get("/size", function (req, res){
    res.sendFile(trimmedPath + "/client/SizeChartPage/index.html");
})

router.get('/products/:id', (req, res) => {
    res.sendFile(trimmedPath + '/client/ProductPage/product.html');
})

router.get('/personals/:id', async (req, res) => {
    res.sendFile(trimmedPath + '/client/PersonalPage/index.html');
});

router.get("/cart", function (req, res){
    res.sendFile(trimmedPath + "/client/CartPage/index.html");
})



module.exports = router;