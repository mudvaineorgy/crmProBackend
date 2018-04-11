var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    calle: { type: String, required: [false, 'null'] },
    colonia: { type: String, required: [false, 'null'] },
    municipio: { type: String, required: [false, 'null'] },
    estadorep: { type: String, required: [false, 'null'] },
    created_at: { type: String, required: [false, 'null'] },
    giro: { type: String, required: [false, 'null'] },
    img: { type: String, required: [false, 'null'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'empresas' });
module.exports = mongoose.model('Empresa', empresaSchema);