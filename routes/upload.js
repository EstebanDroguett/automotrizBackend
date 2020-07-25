var express = require('express');


var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Repuesto = require('../models/repuesto');
var Vehiculo = require('../models/vehiculo');

//Default Options

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de coleccion
    var tiposValidos = ['vehiculos', 'repuestos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida.',
            errors: { message: 'tipo de colección no es válida.' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada.',
            errors: { message: 'Debe seleccionar una imagen.' }
        });
    }

    //Obtener nombre de la imagen
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida.',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo.',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    })


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err)=>{
                    if(err) throw err;
                });
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada.',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'repuestos') {

        Repuesto.findById(id, (err, repuesto) => {

            if (!repuesto) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Repuesto no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            var pathViejo = './uploads/repuestos/' + repuesto.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err)=>{
                    if(err) throw err;
                });
            }

            repuesto.img = nombreArchivo;

            repuesto.save((err, repuestoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de repuesto actualizada',
                    repuesto: repuestoActualizado
                });

            })

        });
    }

    if (tipo === 'vehiculos') {

        Vehiculo.findById(id, (err, vehiculo) => {

            if (!vehiculo) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Vehiculo no existe',
                    errors: { message: 'Vehiculo no existe' }
                });
            }

            var pathViejo = './uploads/vehiculos/' + vehiculo.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err)=>{
                    if(err) throw err;
                });
            }

            vehiculo.img = nombreArchivo;

            vehiculo.save((err, vehiculoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de vehiculo actualizada',
                    vehiculo: vehiculoActualizado
                });

            })

        });
    }
}

module.exports = app;