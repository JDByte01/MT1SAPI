var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

router.post('/InsertarTarjeta', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_InsertarTarjeta(?,?,?,?,?,@output)';
    var args = [req.body.idUsuario,
                req.body.nombre,
                req.body.numero,
                req.body.fechaVencimiento,
                req.body.cvv];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo vincular la tarjeta.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Tarjeta vinculada correctamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la vinculación de la tarjeta.'});
    } );

});

router.post('/ObtenerTarjeta', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTarjeta(?)';
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

router.post('/EliminarTarjeta', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_EliminarTarjeta(?)';
    var args = [req.body.idTarjeta];

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
