// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Servicio = require('../models/servicio');
var Cliente = require('../models/cliente');
var Estado = require('../models/estado')

// default options
app.use(fileUpload());

// =============================================================================
// Upload de imagen por medio de un PUT
// =============================================================================

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos validos de coleccion ===============================================
    var tiposValidos = ['usuarios', 'clientes', 'servicios', 'estados'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Tipo de coleccion no valida' }

        });
        console.log(errors);

    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionaste algun archivo',
            errors: { message: 'debe seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo ===============================================
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extenciones seran permitidas ===============================================
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no válida',
            errors: { message: 'Las extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado ===============================================
    // 12342413243-123.png ===============================================
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    // Mover el archivo del temporal a un path ===============================================
    var path = `./uploads/${ tipo }/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
        /*
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Archivo Movido',
                    path: path
                });
        */
    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === "usuarios") {

        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res
                    .status(400)
                    .json({
                        ok: true,
                        mensaje: "Usuario no existe",
                        errors: { message: 'Usuario no existe' }
                    });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elimina la imagen anterior ===============================================
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: "Imagen de usuario Actualizado",
                    usuario: usuarioActualizado
                });

            })

        });
    }

    if (tipo === "servicios") {
        Servicio.findById(id, (err, servicio) => {
            if (!servicio) {
                return res.status(400).json({
                    ok: true,
                    mensaje: "Servicio no existe",
                    errors: { message: "Servicio no existe" }
                });
            }

            var pathViejo = "./uploads/servicios/" + servicio.img;

            // si existe elimina la imagen anterior ===============================================
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            servicio.img = nombreArchivo;

            servicio.save((err, servicioActualizado) => {
                return res
                    .status(200)
                    .json({
                        ok: true,
                        mensaje: "Imagen de servicio Actualizado",
                        servicio: servicioActualizado
                    });
            });
        });

    }

    if (tipo === "clientes") {
        Cliente.findById(id, (err, cliente) => {
            if (!cliente) {
                return res
                    .status(400)
                    .json({
                        ok: true,
                        mensaje: "Cliente no existe",
                        errors: { message: "Cliente no existe" }
                    });
            }
            var pathViejo = "./uploads/clientes/" + cliente.img;

            // si existe elimina la imagen anterior ===============================================
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            cliente.img = nombreArchivo;

            cliente.save((err, clienteActualizado) => {
                return res
                    .status(200)
                    .json({
                        ok: true,
                        mensaje: "Imagen de cliente Actualizado",
                        cliente: clienteActualizado
                    });
            });
        });
    }

    if (tipo === "estados") {
        Estado.findById(id, (err, estado) => {
            if (!estado) {
                return res.status(400).json({
                    ok: true,
                    mensaje: "Estatus no existe",
                    errors: { message: "Estatus no existe" }
                });
            }

            var pathViejo = "./uploads/estados/" + estado.img;

            // si existe elimina la imagen anterior ===============================================
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            estado.img = nombreArchivo;

            estado.save((err, estadoActualizado) => {
                return res
                    .status(200)
                    .json({
                        ok: true,
                        mensaje: "Imagen de estado Actualizado",
                        estado: estadoActualizado
                    });
            });
        });

    }
}


module.exports = app;