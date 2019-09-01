var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

router.post('/ObtenerPerfil', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_ObtenerPerfil(?)';
    var args = [req.body.idUsuario];

    database.query( sql, args )
    .then( rows => {
        if(!isEmpty(rows[0])){
            res.send(rows[0]);
        } else {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo obtener el perfil.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la obtención de datos del perfil.'});
    } );

});

router.post('/ActualizarPerfil', function(req, res){

	var database = new Database();
    var sql = 'CALL SP_ActualizarPerfil(?,?,?,?,?,?,?,?,@output)';
    var args = [req.body.idUsuario, req.body.nombre, req.body.apellido, req.body.telefono, req.body.identificacion, req.body.domicilio, req.body.nit, req.body.idPais];

	database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'Los datos ingresados no son válidos.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Se ha modificado el perfil correctamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
    	console.log(err);
    	res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la modificación del perfil.'});
    } );

});

router.post('/CambiarPassword', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_CambiarPassword(?,?,?,@output)';
    var args = [req.body.idUsuario, req.body.password, req.body.passwordNueva];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'La contraseña actual no es correcta.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Se ha cambiado la contraseña.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante el cambio de contraseña.'});
    } );

});

module.exports = router;
