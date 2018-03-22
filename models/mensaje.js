var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var mensajeSchema = new Schema({
    texto: { type: String, required: [true, 'El	texto	es	necesario'] },
    created_at: { type: String, required: [false, 'null'] },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'mensajes' });
module.exports = mongoose.model('Mensaje', mensajeSchema);