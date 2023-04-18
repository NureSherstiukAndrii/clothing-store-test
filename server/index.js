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


app.get('/script.js', (req, res) => {
    res.type('text/javascript');
    res.sendFile(__dirname + '/script.js');
});

app.get("/getAllTours", function(request, response){
    const db = dbService.getDbServiceInstance();
    let result = db.getAllTours();

    result
        .then((data) => response.json({ data: data }))
        .catch((err) => console.log(err));
});


app.post('/insertTour', (req, res) => {
    const {id, name} = req.body;
    const db = dbService.getDbServiceInstance()

    const result = db.addTour(+id, name)

    result
        .then((data) => {res.json({ data: data }); console.log(data)})
        .catch((err) => console.log(err));
});

app.delete("/deleteTour/:id", (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteTour(id);

    result
        .then((data) => response.json({ success: data }))
        .catch((err) => console.log(err));
});

app.patch("/updateTour", (request, response) => {
    console.log(request);
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.editTour(+id, name);
    result
        .then((data) => response.json({ success: data }))
        .catch((err) => console.log(err));
});

app.listen(3000);