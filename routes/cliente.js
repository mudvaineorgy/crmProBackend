// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mdAuctenticacion = require('../middlewares/Autenticacion');

var app = express();

var Cliente = require('../models/cliente');

// =======================================================================================
// Obtener todos los clientes GET
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({}, 'nombre img')
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email img')
        .populate('estado')
        .populate('servicio')
        .exec(
            (err, clientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Cliente.count({}, (err, conteo) => {
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
                        clientes: clientes,

                    });

                })


            })

});

// ==========================================
// Obtener CLIENTE por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('servicio')
        .populate('estado')
        .exec((err, cliente) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar cliente',
                    errors: err
                });
            }

            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + ' no existe',
                    errors: {
                        message: 'No existe un cliente con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                cliente: cliente
            });
        })
})


// =============================================================================
// Actualizar Cliente PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id' + id + 'No existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }

        cliente.nombre = body.nombre;
        cliente.usuario = req.usuario._id;
        cliente.servicio = body.servicio;
        cliente.estado = body.estado;
        console.log(body.estado);

        cliente.save((err, clienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado,
                mensaje: 'Cliente actualizado correctamente'
            });
        });
    });
});


// =======================================================================================================
// Crear un nuevo cliente POST
// =======================================================================================================
app.post('/', mdAuctenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cliente = new Cliente({
        nombre: body.nombre,
        usuario: req.usuario._id,
        estado: body.estado,
        servicio: body.servicio
    });

    cliente.save((err, clienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });

    });

});

// =============================================================================
// Eliminacion de clientes por id DELETE
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }

        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe cliente con ese id',
                errors: { message: 'cliente vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente: clienteBorrado,
            mensaje: 'Cliente fue eliminado correctamente'
        });

    });

});


module.exports = app;