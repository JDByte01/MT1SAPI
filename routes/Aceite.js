var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

router.get('/ObtenerMarcaAceite', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerMarcaAceite()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las marcas de aceite.'});
    } );

});

router.get('/ObtenerTipoAceite', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTipoAceite()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los tipos de aceite.'});
    } );

});

router.get('/ObtenerTipoViscosidad', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerTipoViscosidad()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener los tipos de viscosidad.'});
    } );

});

router.get('/ObtenerMarcaFiltroAceite', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerMarcaFiltroAceite()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las marcas de filtro de aceite.'});
    } );

});

module.exports = router;
