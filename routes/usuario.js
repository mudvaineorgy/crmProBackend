// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var bcrypt = require('bcryptjs'); // Se carga la libreria de ebycript para encriptar contrasenas.
var jwt = require('jsonwebtoken');

var mdAuctenticacion = require('../middlewares/Autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// =======================================================================================
// Obtener todos los usuarios GET
// =======================================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(10)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
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
                        usuarios: usuarios,

                    });

                })


            })

});


// =============================================================================
// Actualizar usuario PUT
// =============================================================================

app.put('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'No existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                mensaje: 'Usuario actualizado correctamente'
            });
        });
    });
});

// =======================================================================================================
// Crear un nuevo usuario POST
// =======================================================================================================
app.post('/', /*mdAuctenticacion.verificaToken,*/ (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});

// =============================================================================
// Eliminacion de usuarios por id DELETE
// =============================================================================

app.delete('/:id', mdAuctenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'Usuario vacio' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            mensaje: 'Usuario fue eliminmado correctamente'
        });

    });

});


module.exports = app;