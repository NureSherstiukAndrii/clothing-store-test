const express = require("express");
const path = require("path");
const router = express.Router();

const parentDir = path.resolve(__dirname, '..').replace("\\server", "");

router.get("/", function (req, res){
    res.sendFile( parentDir + "/client/HomePage/index.html");
})

router.get("/about", function (req, res){
    res.sendFile(parentDir + "/client/AboutUsPage/index.html");
})

router.get("/shop", function (req, res){
    res.sendFile(parentDir + "/client/ShopPage/index.html");
})

router.get("/contacts", function (req, res){
    res.sendFile(parentDir + "/client/ContactPage/index.html");
})

router.get("/login", function (req, res){
    res.sendFile(parentDir + "/client/LogInPage/index.html");
})

router.get("/registration", function (req, res){
    res.sendFile(parentDir + "/client/RegistrationPage/index.html");
})

router.get("/size", function (req, res){
    res.sendFile(parentDir + "/client/SizeChartPage/index.html");
})

router.get('/products/:id', (req, res) => {
    res.sendFile(parentDir + '/client/ProductPage/product.html');
})

router.get('/personals/:id', async (req, res) => {
    res.sendFile(parentDir + '/client/PersonalPage/index.html');
});



module.exports = router;