// Requires, importacion de librerias que se necesitan para que funcione.
var express = require('express'); // Se carga la libreria de express.
var mongoose = require('mongoose'); // Se carga la libreria de mongoose.
var bodyParser = require('body-parser'); // Se carga la libreria de body-parser.


// Inicializar variables.
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, CONTROLS");
    next();
});


// =============================================================================
// Body parser //Midelwares que siempre se ejecutaran
// =============================================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var servicioRoutes = require('./routes/servicio');
var clienteRoutes = require('./routes/cliente');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require("./routes/imagenes");
var busquedaRoutes = require('./routes/busqueda');
var estadoRoutes = require('./routes/estado');
var empresaRoutes = require('./routes/empresa');
var giroRoutes = require('./routes/giro');
var mensajeRoutes = require('./routes/mensaje');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/ventasDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

/*
// Server index config ===============================================
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/

// RUTAS
app.use('/usuario', usuarioRoutes);
app.use('/servicio', servicioRoutes);
app.use('/cliente', clienteRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/estado', estadoRoutes);
app.use('/empresa', empresaRoutes);
app.use('/giro', giroRoutes);
app.use('/mensaje', mensajeRoutes);
app.use('/', appRoutes);


// Escuchar peticiones del express. se utiliza el puerto 3000(puede colocarse cualquier puerto 8080, 8081)
app.listen(3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m', 'online'); // codigo para cambiar color de la letra \x1b[32m%s\x1b[0m
})