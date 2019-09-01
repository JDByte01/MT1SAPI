var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var Database = require('./Database.js');

router.post('/InsertarMecanico', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_InsertarMecanico(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@output)';
    var args = [req.body.email,
                req.body.password,
                req.body.nombre,
                req.body.apellido,
                req.body.telefono,
                req.body.dpi,
                req.body.direccion,
                req.body.nit,
                req.body.idPais,
                req.body.placa,
                req.body.anio,
                req.body.idMarcaMoto,
                req.body.idLineaMoto,
                req.body.nombreTarjeta,
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
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'No se pudo crear la cuenta, es posible que el email ya este registrado.'});
        } else {
            res.send({estilo: 'success', titulo: 'Correcto', mensaje:'Cuenta creada exitosamente.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la creación de la cuenta.'});
    } );

});

module.exports = router;
