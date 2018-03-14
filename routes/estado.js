// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');

var app = express();

var Estado = require('../models/estado');

// =======================================================================================
// OBTENER ESTATUS EXISTENTES GET
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Estado.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(10)
        .exec(
            (err, estados) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando estados existentes',
                        errors: err
                    });
                }
                Estado.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando estados existentes',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        estados: estados,

                    });

                })


            })

});

// ==========================================
// OBTENER SERVICIO POR ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Estado.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, estado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar estado',
                    errors: err
                });
            }
            if (!estado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El estado con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un estado con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                estado: estado
            });
        })
})



// =============================================================================
// ACTUALIZAR ESTATUS PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Estado.findById(id, (err, estado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar estado',
                errors: err
            });
        }

        if (!estado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El estado con el id' + id + 'No existe',
                errors: { message: 'No existe un estado con ese ID' }
            });
        }

        estado.nombre = body.nombre;
        estado.descripcion = body.descripcion;
        estado.usuario = req.usuario._id;

        estado.save((err, estadoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar estado',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                estado: estadoGuardado
            });
        });
    });
});


// =======================================================================================================
// CREAR UN NUEVO ESTADO POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var estado = new Estado({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    estado.save((err, estadoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el estado',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            estado: estadoGuardado
        });

    });

});

// =============================================================================
// Eliminacion de un ESTADO por id DELETE
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Estado.findByIdAndRemove(id, (err, estadoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar estado',
                errors: err
            });
        }

        if (!estadoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe estado con ese id',
                errors: { message: 'estado vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            estado: estadoBorrado,
            mensaje: 'Estado fue eliminado correctamente'
        });

    });

});

module.exports = app;