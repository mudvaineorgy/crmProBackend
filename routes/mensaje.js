// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');

var app = express();

var Mensaje = require('../models/mensaje');

// =======================================================================================
// OBTENER MENSAJES EXISTENTES GET 
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Mensaje.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(10)
        .exec(
            (err, mensajes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando mensajes existentes',
                        errors: err
                    });
                }
                Mensaje.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando mensajes existentes',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        mensajes: mensajes,

                    });

                })


            })

});

// =======================================================================================================
// CREAR UN MENSAJE POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var mensaje = new Mensaje({
        texto: body.texto,
        usuario: req.usuario._id
    });

    mensaje.save((err, mensajeGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el mensaje',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            mensaje: mensajeGuardado
        });

    });

});


// =============================================================================
// ELIMINACION DE UN MENSAJE
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Mensaje.findByIdAndRemove(id, (err, mensajeBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar mensaje',
                errors: err
            });
        }

        if (!mensajeBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe mensaje con ese id',
                errors: { message: 'mensaje vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'Mensaje fue eliminado correctamente'
        });

    });

});

module.exports = app;