// Requires, importacion de librerias que se necesitan para que funcione.
var express = require("express"); // Se carga la libreria de express.
var fs = require('fs');

var app = express();

app.get("/:tipo/:img", (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${tipo}/${img}`;

    fs.exists(path, existe => {
        if (!existe) {
            path = './assets/no-img.jpg'
        }

        res.sendfile(path);
    });


});

module.exports = app;