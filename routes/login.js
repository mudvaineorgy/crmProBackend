// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var bcrypt = require('bcryptjs'); // Se carga la libreria de ebycript para encriptar contrasenas.
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

var GoogleAuth = require('google-auth-library');

var auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require("../config/config").GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;

// =============================================================================
// LOGIN DEL SISTEMA
// =============================================================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // =============================================================================
        // crear un token
        // =============================================================================
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }) // 8Horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });

    });





});



// =============================================================================
// LOGIN DE GOOGLE
// =============================================================================

app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX';

    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {
            if (e) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'token no valido',
                    errors: e
                });
            }

            var payload = login.getPayload();
            var userid = payload["sub"];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al buscar usuario - login',
                        errors: err
                    });
                }

                if (usuario) {
                    if (!usuario.google) {
                        return res
                            .status(400)
                            .json({
                                ok: true,
                                mensaje: "Debe usar su autenticacion del sistema",
                                errors: err
                            });
                    } else {
                        usuario.password = ":)";

                        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 28800 }); // 8Horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuario,
                            token: token,
                            id: usuario.id,
                            menu: obtenerMenu(usuario.role)
                        });
                    }

                    // Si el usuario no existe por correo ===============================================
                } else {
                    var usuario = new Usuario();
                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = ':)';
                    usuario.img = payload.picture;
                    usuario.google = true;


                    usuario.save((err, usuarioDB) => {
                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: "Error al crear usuario - google",
                                errors: err
                            });
                        }

                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 28800 }); // 8Horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB.id,
                            menu: obtenerMenu(usuarioDB.role)
                        });
                    });
                }


            });
        });


});

function obtenerMenu(ROLE) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Barras de Progreso', url: '/progress' },
                { titulo: 'Graficas', url: '/grafica1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' }
            ]
        },

        {
            titulo: 'Sistema Crm Pro',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Clientes', url: '/clientes' },
                { titulo: 'Servicios', url: '/servicios' },
                { titulo: 'Estados', url: '/estados' },
                { titulo: 'Empresas', url: '/empresas' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}

module.exports = app;