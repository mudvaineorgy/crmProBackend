var jwt = require('jsonwebtoken');
var moment = require('moment');

var SEED = require('../config/config').SEED;

// =============================================================================
// Verificar TOKEN MIDDLEWARE
// =============================================================================
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

};