var express = require('express');

var mdAuthentication = require('../middleware/authentication');

var app = express();

var Vehiculo = require('../models/vehiculo');

//Obtener todos los vehículos

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Vehiculo.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, vehiculos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando vehículo',
                        errors: err
                    });
                }

                Vehiculo.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        vehiculos: vehiculos,
                        total: conteo
                    });
                })

            });

});

//Obtener vehículo

app.get('/:id', (req, res) =>{

    var id = req.params.id;

    Vehiculo.findById(id)
        .populate('usuario', 'nombre email img') //populate sirve para indicar la tabla y los campos que quiero mostrar y recibir
        .exec((err, vehiculo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar vehículo',
                    errors: err
                });
            }
    
            if (!vehiculo) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El vehículo con el id ' + id + ' no existe',
                    errors: { message: 'No existe un vehículo con ese Id' }
                });
            }

            res.status(200).json({
                ok: true,
                vehiculo: vehiculo
            });
        })
})


//Actualizar vehiculo

app.put('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Vehiculo.findById(id, (err, vehiculo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar vehiculo',
                errors: err
            });
        }

        if (!vehiculo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El vehiculo con el id ' + id + ' no existe',
                errors: { message: 'No existe un vehiculo con ese Id' }
            });
        }

        vehiculo.propietario = body.propietario;
        vehiculo.correo = body.correo;
        vehiculo.telefono = body.telefono;
        vehiculo.patente = body.patente;
        vehiculo.vehiculo = body.vehiculo;
        vehiculo.color = body.color;
        //vehiculo.cantidad_de_puertas = body.cantidad_de_puertas;
        vehiculo.usuario = req.usuario._id;

        vehiculo.save((err, vehiculoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar vehiculo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                vehiculo: vehiculoGuardado
            });
        });

    });

});

//Crear un nuevo vehiculo

app.post('/', mdAuthentication.verificaToken, (req, res) => {

    var body = req.body;

    var vehiculo = new Vehiculo({
        propietario: body.propietario,
        correo: body.correo,
        telefono: body.telefono,
        patente: body.patente,
        vehiculo: body.vehiculo,
        color: body.color,
        //cantidad_de_puertas: body.cantidad_de_puertas,
        usuario: req.usuario._id
    });

    vehiculo.save((err, vehiculoGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear vehiculo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            vehiculo: vehiculoGuardado,
        });

    });

});

//Borrar un vehiculo por el Id
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Vehiculo.findByIdAndRemove(id, (err, vehiculoBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar vehiculo',
                errors: err
            });
        }

        if (!vehiculoBorrado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe un vehiculo con ese id',
                errors: { message: 'No existe un vehiculo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            vehiculo: vehiculoBorrado
        });
    });
});

module.exports = app;