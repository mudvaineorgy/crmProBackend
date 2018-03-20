var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: [false, 'null'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    estado: {
        type: Schema.Types.ObjectId,
        ref: 'Estado',
        required: [true, 'El id del estado es un campo oblibatorio']
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: [true, 'El id del servicio es un campo oblibatorio']
    }

});

module.exports = mongoose.model('Cliente', clienteSchema);