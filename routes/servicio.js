// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');
var moment = require('moment');

var app = express();

var Servicio = require('../models/servicio');

// =======================================================================================
// OBTENER SERVICIOS  GET
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Servicio.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(10)
        .exec(
            (err, servicios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando servicios',
                        errors: err
                    });
                }
                Servicio.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuarios',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        servicios: servicios,

                    });
                })
            })
});

// ==========================================
// OBTENER SERVICIO POR ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Servicio.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, servicio) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar servicio',
                    errors: err
                });
            }
            if (!servicio) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El servicio con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un servicio con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                servicio: servicio
            });
        })
})



// =============================================================================
// ACTUALIZAR SERVICIO PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Servicio.findById(id, (err, servicio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar servicio',
                errors: err
            });
        }

        if (!servicio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El servicio con el id' + id + 'No existe',
                errors: { message: 'No existe un servicio con ese ID' }
            });
        }

        servicio.nombre = body.nombre;
        servicio.usuario = req.usuario._id;


        servicio.save((err, servicioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar servicio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                servicio: servicioGuardado
            });
        });
    });
});


// =======================================================================================================
// CREAR UN NUEVO SERVICIO POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var servicio = new Servicio({
        nombre: body.nombre,
        usuario: req.usuario._id,
        created_at: moment().format('DD MM YYYY, h:mm:ss a')
    });

    servicio.save((err, servicioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el servicio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            servicio: servicioGuardado
        });

    });

});

// =============================================================================
// Eliminacion de servicios por id DELETE
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Servicio.findByIdAndRemove(id, (err, servicioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar servicio',
                errors: err
            });
        }

        if (!servicioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe servicio con ese id',
                errors: { message: 'servicio vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            servicio: servicioBorrado,
            mensaje: 'Servicio fue eliminado correctamente'
        });

    });

});

module.exports = app;