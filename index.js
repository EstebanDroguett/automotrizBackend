//Requires
/*require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');

//Inicializar variables
const app = express();

//CORS
app.use(cors());
//app.options('*', cors());

/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const vehiculoRoutes = require('./routes/vehiculo');
const repuestoRoutes = require('./routes/repuesto');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

//Conexión a la base de datos
/*mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, tlsAllowInvalidHostnames: true,
        tlsAllowInvalidCertificates: true
    })
    .then(() => console.log('Base de datos \x1b[32m%s\x1b[0m', 'online'))
    .catch(err => console.log(err));*/

mongoose.connection.openUri(/*process.env.MONGODB_URI*/ 'mongodb+srv://esteban:admin123456@cluster0.bhlbp.mongodb.net/automotrizDB?retryWrites=true&w=majority' , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/vehiculo', vehiculoRoutes);
app.use('/repuesto', repuestoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);

//Configuración
const port = process.env.PORT || 3000;

//Escuchar peticiones
app.listen(port, () => {
    //console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
    console.log('Puerto \x1b[32m%s\x1b[0m conectado', `${port}`);
});