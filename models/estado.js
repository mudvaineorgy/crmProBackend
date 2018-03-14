var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var estadoSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: [false, 'null'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'estados' });
module.exports = mongoose.model('Estado', estadoSchema);