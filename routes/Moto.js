var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

router.get('/ObtenerMarcaMoto', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerMarcaMoto()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las marcas de moto.'});
    } );

});

router.post('/ObtenerLineaMoto', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerLineaMoto(?)';
    var args = [req.body.idMarcaMoto];

    database.query( sql, args )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las lineas de moto.'});
    } );

});

module.exports = router;
