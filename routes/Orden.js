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

router.post('/ObtenerTotalOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_ObtenerTotalOrden(?,?,?,?,?,?,?)';
    var args = [req.body.idUsuario,
                req.body.idVehiculoCliente,
                req.body.idServicio,
                req.body.idMarcaAceite,
                req.body.idTipoAceite,
                req.body.idTipoViscosidad,
                req.body.idMarcaFiltroAceite];

    database.query( sql, args )
    .then( rows => {
        if(!isEmpty(rows[0])){
            res.send(rows[0]);
        } else {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo obtener el total de la orden, es posible que los productos seleccionados no estén en nuestro catálogo.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la obtención del total de la orden.'});
    } );

});

router.post('/InsertarOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_InsertarOrden(?,?,?,?,?,?,?,?,?,?,?,?,@output)';
    var args = [req.body.idUsuario,
                req.body.fechaHoraInicio,
                req.body.direccion,
                req.body.latitud,
                req.body.longitud,
                req.body.idVehiculoCliente,
                req.body.idServicio,
                req.body.idMarcaAceite,
                req.body.idTipoAceite,
                req.body.idTipoViscosidad,
                req.body.idMarcaFiltroAceite,
                req.body.total];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo generar la orden.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Orden gererada exitosamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la generación de la orden.'});
    } );

});

router.post('/ObtenerOrdenMecanico', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerOrdenMecanico(?)';
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
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las ordenes.'});
    } );

});

router.post('/ObtenerOrdenCliente', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerOrdenCliente(?)';
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
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las ordenes.'});
    } );

});

router.post('/ObtenerEstadoOrden', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerEstadoOrden(?)';
    var args = [req.body.idOrden];

    database.query( sql, args )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener el estado de la orden.'});
    } );

});

router.post('/ActualizarEstadoOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_ActualizarEstadoOrden(?,?,?,@output)';
    var args = [req.body.idOrden, req.body.valor, req.body.fechaHoraFin];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo actualizar la orden.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Orden actualizada correctamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la actualización de la orden.'});
    } );

});

router.get('/ObtenerOrdenes', function(req, res, next) {

    var database = new Database();
    var sql = 'CALL SP_ObtenerOrdenes()';

    database.query( sql )
    .then( rows => {
        res.send(rows[0]);
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error al obtener las ordenes.'});
    } );

});

router.post('/AtenderOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_AtenderOrden(?,?,@output)';
    var args = [req.body.idUsuario, req.body.idOrden];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo tomar la orden.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Orden tomada correctamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la toma de la orden.'});
    } );

});

router.post('/ObtenerPerfilMecanicoOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_ObtenerPerfilMecanicoOrden(?)';
    var args = [req.body.idOrden];

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

router.post('/ObtenerPerfilClienteOrden', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_ObtenerPerfilClienteOrden(?)';
    var args = [req.body.idOrden];

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

module.exports = router;
