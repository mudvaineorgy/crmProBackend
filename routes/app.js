// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.

var app = express();


app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

module.exports = app;