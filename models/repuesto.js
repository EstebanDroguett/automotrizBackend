var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var repuestoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    cantidad: { type: String, required: [true, 'La cantidad es necesaria'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    vehiculo: {
        type: Schema.Types.ObjectId, ref: 'Vehiculo', required: [true, 'El id vehiculo es un campo obligatorio']
    }
});
module.exports = mongoose.model('Repuesto', repuestoSchema);