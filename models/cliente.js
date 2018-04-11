var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    puesto: { type: String, required: [false, 'null'] },
    email: { type: String, required: [false, 'null'] },
    telefono: { type: String, required: [false, 'null'] },
    cumple: { type: String, required: [false, 'null'] },
    nombre2: { type: String, required: [false, 'null'] },
    puesto2: { type: String, required: [false, 'null'] },
    email2: { type: String, required: [false, 'null'] },
    telefono2: { type: String, required: [false, 'null'] },
    cumple2: { type: String, required: [false, 'null'] },
    img: { type: String, required: [false, 'null'] },
    created_at: { type: String, required: [false, 'null'] },
    archivo: { type: String, required: [false, 'null'] },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Schema.Types.ObjectId,
        ref: 'Estado',
        required: [true, 'El id del estado es un campo oblibatorio']
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: [true, 'El id del servicio es un campo oblibatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'El id de la empresa es un campo oblibatorio']
    },
    mensaje: {
        type: Schema.Types.ObjectId,
        ref: 'Mensaje',
        required: false
    }

});

module.exports = mongoose.model('Cliente', clienteSchema);