// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');
var moment = require('moment');

var app = express();

var Giro = require('../models/giro');

// =======================================================================================
// OBTENER GIROS EXISTENTES GET 
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Giro.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(10)
        .exec(
            (err, giros) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando giros existentes',
                        errors: err
                    });
                }
                Giro.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando giros existentes',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        giros: giros,

                    });

                })


            })

});

// ==========================================
// OBTENER GIRO POR ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Giro.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, giro) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar giro',
                    errors: err
                });
            }
            if (!giro) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El giro con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un giro con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                giro: giro
            });
        })
})



// =============================================================================
// ACTUALIZAR GIRO PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Giro.findById(id, (err, giro) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar giro',
                errors: err
            });
        }

        if (!giro) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El giro con el id' + id + 'No existe',
                errors: { message: 'No existe un giro con ese ID' }
            });
        }

        giro.nombre = body.nombre;
        giro.usuario = req.usuario._id;

        giro.save((err, giroGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar giro',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                giro: giroGuardado
            });
        });
    });
});


// =======================================================================================================
// CREAR UN GIRO POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var giro = new Giro({
        nombre: body.nombre,
        usuario: req.usuario._id,
        created_at: moment().format('DD MM YYYY, h:mm:ss a')
    });

    giro.save((err, giroGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el giro',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            giro: giroGuardado
        });

    });

});

// =============================================================================
// ELIMINACION DE UNA GIRO
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Giro.findByIdAndRemove(id, (err, giroBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar giro',
                errors: err
            });
        }

        if (!giroBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe giro con ese id',
                errors: { message: 'giro vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            giro: giroBorrado,
            mensaje: 'Giro fue eliminado correctamente'
        });

    });

});

module.exports = app;