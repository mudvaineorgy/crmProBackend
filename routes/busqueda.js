// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.

var app = express();
var Servicio = require('../models/servicio');
var Cliente = require('../models/cliente');
var Usuario = require('../models/usuario');

// =============================================================================
// Generando una busqueda por categoria
// =============================================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'servicios':
            promesa = buscarServicios(busqueda, regex);
            break;

        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: ' Los tipos de busqueda solo son usuarios, clientes y servicios',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })

});

// =============================================================================
// busqueda general
// =============================================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarServicios(busqueda, regex),
            buscarClientes(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                servicios: respuestas[0],
                clientes: respuestas[1],
                usuarios: respuestas[2]
            });

        })

});

function buscarServicios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Servicio.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, servicios) => {
                if (err) {
                    reject('error al cargar servicios', err);
                } else {
                    resolve(servicios)
                }
            });

    });
}

function buscarClientes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cliente.find({ nombre: regex })
            .populate('usuario', 'nombre gmail')
            .populate('servicio')
            .exec((err, clientes) => {

                if (err) {
                    reject('error al cargar servicios', err);
                } else {
                    resolve(clientes)
                }
            });

    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error al cargar servicios', err);
                } else {
                    resolve(usuarios);
                }

            })
    });
}

module.exports = app;