var express = require('express');

var mdAuthentication = require('../middleware/authentication');

var app = express();

var Repuesto = require('../models/repuesto');

//Obtener todos los repuestos

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Repuesto.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('vehiculo')
        .exec(

            (err, repuestos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando repuesto',
                        errors: err
                    });
                }

                Repuesto.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        repuestos: repuestos,
                        total: conteo
                    });
                })

            });

});

//Obtener repuesto

app.get('/:id', (req, res) =>{

    var id = req.params.id;

    Repuesto.findById(id)
        .populate('usuario', 'nombre email img') //populate sirve para indicar la tabla y los campos que quiero mostrar y recibir
        .populate('vehiculo') //Al elegir solo la tabla, significa que quiero mostrar todo lo que contenga ese objeto
        .exec((err, repuesto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar repuesto',
                    errors: err
                });
            }
    
            if (!repuesto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El repuesto con el id ' + id + ' no existe',
                    errors: { message: 'No existe un repuesto con ese Id' }
                });
            }

            res.status(200).json({
                ok: true,
                repuesto: repuesto
            });
        })
})

//Actualizar repuesto
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Repuesto.findById(id, (err, repuesto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar repuesto',
                errors: err
            });
        }

        if (!repuesto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El repuesto con el id ' + id + ' no existe',
                errors: { message: 'No existe un repuesto con ese Id' }
            });
        }

        repuesto.nombre = body.nombre;
        repuesto.cantidad = body.cantidad;
        repuesto.usuario = req.usuario._id;
        repuesto.vehiculo = body.vehiculo;

        repuesto.save((err, repuestoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar repuesto',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                repuesto: repuestoGuardado
            });
        });

    });

});

//Crear un nuevo repuesto

app.post('/', mdAuthentication.verificaToken, (req, res) => {

    var body = req.body;

    var repuesto = new Repuesto({
        nombre: body.nombre,
        cantidad: body.cantidad,
        usuario: req.usuario._id,
        vehiculo: body.vehiculo
    });

    repuesto.save((err, repuestoGuardado) => {

        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear repuesto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            repuesto: repuestoGuardado,
        });

    });

});

//Borrar un repuesto por el Id
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Repuesto.findByIdAndRemove(id, (err, repuestoBorrado) => {

        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar repuesto',
                errors: err
            });
        }

        if (!repuestoBorrado) {
            res.status(400).json({
                ok: false,
                mensaje: 'No existe un repuesto con ese id',
                errors: { message: 'No existe un repuesto con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            repuesto: repuestoBorrado
        });
    });
});

module.exports = app;