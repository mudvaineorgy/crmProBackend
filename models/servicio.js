var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicioSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: [false, 'null'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'servicios' });
module.exports = mongoose.model('Servicio', servicioSchema);