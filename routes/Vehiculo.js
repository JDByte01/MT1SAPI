var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

router.get('/ObtenerMarcaVehiculo', function(req, res, next) {

	var database = new Database();
  	var sql = 'CALL SP_ObtenerMarcaVehiculo()';

	database.query( sql )
    .then( rows => {
		res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
    	console.log(err);
    	res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las marcas de vehículo.'});
    } );

});

router.post('/ObtenerLineaVehiculo', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerLineaVehiculo(?)';
    var args = [req.body.idMarcaVehiculo];

    database.query( sql, args )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las lineas de vehículo.'});
    } );

});

router.get('/ObtenerTipoVehiculo', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTipoVehiculo()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los tipos de vehículo.'});
    } );

});

router.get('/ObtenerTipoCombustible', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTipoCombustible()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los tipos de combustible.'});
    } );

});

router.get('/ObtenerTamanioMotor', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTamanioMotor()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los tamaños de motor.'});
    } );

});

router.post('/InsertarVehiculoCliente', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_InsertarVehiculoCliente(?,?,?,?,?,?,?,?,@output)';
    var args = [req.body.idUsuario,
                req.body.nombre,
                req.body.anio,
                req.body.idMarcaVehiculo,
                req.body.idLineaVehiculo,
                req.body.idTipoVehiculo,
                req.body.idTipoCombustible,
                req.body.idTamanioMotor];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo crear el vehículo, es posible que no se encuentre en nuestro catálogo.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Vehículo creado correctamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la creación del vehículo.'});
    } );

});

router.post('/ObtenerVehiculoCliente', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerVehiculoCliente(?)';
    var args = [req.body.idUsuario];

    database.query( sql, args )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los vehículos.'});
    } );

});

router.post('/EliminarVehiculoCliente', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_EliminarVehiculoCliente(?)';
    var args = [req.body.idVehiculoCliente];

    database.query( sql, args )
    .then( rows => {
        res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Vehículo eliminado correctamente.'});
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al eliminar el vehículo.'});
    } );

});

module.exports = router;
