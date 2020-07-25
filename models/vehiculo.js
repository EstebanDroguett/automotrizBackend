var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vehiculoSchema = new Schema({
    propietario: { type: String, required: [true, 'El propietario es necesario'] },
    correo: { type: String, required: [true, 'El correo es necesario'] },
    telefono: { type: String, required: [true, 'El teléfono es necesario'] },
    patente: { type: String, required: [true, 'La patente es necesaria'] },
    vehiculo: { type: String, required: [true, 'El vehículo es necesario'] },
    color: { type: String, required: [true, 'El color es necesario'] },
    //cantidad_de_puertas: { type: String, required: [true, 'La cantidad de puertas es necesaria'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'vehiculos' });


module.exports = mongoose.model('Vehiculo', vehiculoSchema);