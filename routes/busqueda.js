var express = require('express');

var app = express();

var Vehiculo = require('../models/vehiculo');
var Repuesto = require('../models/repuesto');
var Usuario = require('../models/usuario');

//Busqueda específica

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'vehiculos':
            promesa = buscarVehiculos(busqueda, regex);
            break;

        case 'repuestos':
            promesa = buscarRepuestos(busqueda, regex);
            break;

        default:
            return res.status(200).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son:  usuarios, vehiculos y repuestos.',
                error: { message: 'Tipo de tabla/colección no válido.' }

            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data //Los corchetes sirven para buscar el resultado no la tabla en si.

        });
    });

});

//Busqueda general

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarVehiculos(busqueda, regex),
        buscarRepuestos(busqueda, regex),
        buscarUsuarios(busqueda, regex),
    ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                vehiculos: respuestas[0],
                repuestos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarVehiculos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Vehiculo.find({ vehiculo: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, vehiculos) => {

                if (err) {
                    reject('Error al cargar vehiculos', err);
                } else {
                    resolve(vehiculos)
                }

            });
    });
}

function buscarRepuestos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Repuesto.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('vehiculo')
            .exec((err, repuestos) => {

                if (err) {
                    reject('Error al cargar repuestos', err);
                } else {
                    resolve(repuestos)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });
    });
}


module.exports = app;