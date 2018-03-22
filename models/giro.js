var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var giroSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    created_at: { type: String, required: [false, 'null'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'giros' });
module.exports = mongoose.model('Giro', giroSchema);