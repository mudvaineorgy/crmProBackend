// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');
var moment = require('moment');

var app = express();

var Empresa = require('../models/empresa');

// =======================================================================================
// OBTENER EMPRESAS EXISTENTES GET 
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Empresa.find({})
        .populate('usuario', 'nombre email apodo img ')
        .skip(desde)
        .limit(10)
        .exec(
            (err, empresas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando empresas existentes',
                        errors: err
                    });
                }
                Empresa.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando empresas existentes',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        empresas: empresas,

                    });

                })


            })

});

// ==========================================
// OBTENER EMPRESA POR ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Empresa.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, empresa) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar empresa',
                    errors: err
                });
            }
            if (!empresa) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El empresa con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un empresa con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                empresa: empresa
            });
        })
})



// =============================================================================
// ACTUALIZAR EMPRESA PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Empresa.findById(id, (err, empresa) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar empresa',
                errors: err
            });
        }

        if (!empresa) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El empresa con el id' + id + 'No existe',
                errors: { message: 'No existe un empresa con ese ID' }
            });
        }

        empresa.nombre = body.nombre;
        empresa.calle = body.calle;
        empresa.colonia = body.colonia;
        empresa.municipio = body.municipio;
        empresa.estadorep = body.estadorep;
        empresa.img = body.img;
        empresa.giro = body.giro;
        empresa.usuario = req.usuario._id;

        empresa.save((err, estadoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar empresa',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                empresa: estadoGuardado
            });
        });
    });
});

// =======================================================================================================
// CREAR UNA NUEVA EMPRESA POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    var empresa = new Empresa({
        nombre: body.nombre,
        calle: body.calle,
        colonia: body.colonia,
        municipio: body.municipio,
        estadorep: body.estadorep,
        img: body.img,
        giro: body.giro,
        usuario: req.usuario._id,
        created_at: moment().format('Do MMMM YYYY, h:mm:ss a')
    });

    empresa.save((err, estadoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el empresa',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            empresa: estadoGuardado
        });

    });

});

// =============================================================================
// ELIMINACION DE UNA EMPRESA
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Empresa.findByIdAndRemove(id, (err, estadoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar empresa',
                errors: err
            });
        }

        if (!estadoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe empresa con ese id',
                errors: { message: 'empresa vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            empresa: estadoBorrado,
            mensaje: 'Empresa fue eliminado correctamente'
        });

    });

});

module.exports = app;