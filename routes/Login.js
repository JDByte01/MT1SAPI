var express = require('express');
var router = express.Router();

const nodemailer = require("nodemailer");

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

function getCode() {

	var numbers = "0123456789";
	var value = '';

	for (var i = 0; i < 5; i++) {
	    value += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}

	return value;
}

router.post('/AutenticarUsuario', function(req, res){
    
    var database = new Database();
    var sql = 'CALL SP_AutenticarUsuario(?,?)';
    var args = [req.body.email, req.body.password];

    database.query( sql, args )
    .then( rows => {
        if(!isEmpty(rows[0])){
            res.send(rows[0]);
        } else {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'Email o contraseña incorrectos.'});
        }
        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
        console.log(err);
        res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante la autenticación de usuario.'});
    } );

});

router.post('/RecuperarPassword', function(req, res){	

	var resetCode = getCode();

	var database = new Database();	
    var sql = 'CALL SP_RecuperarPassword(?,?,@output)';
    var args = [req.body.email, resetCode];

	database.query( sql, args )
    .then( rows => {
	    var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
	
    	if(rows[0].output === 0) {
			res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'El email ingresado no esta registrado.'});
    	} else {

			async function main(){

			  let testAccount = await nodemailer.createTestAccount();

			  let transporter = nodemailer.createTransport({
			    host: 'smtp.gmail.com',
			    port: 465,
			    secure: true, // use SSL
			    auth: {
			      user: 'app.mantto@gmail.com', // generated ethereal user
			      pass: '1usuario@' // generated ethereal password
			    }
			  });

			  let info = await transporter.sendMail({
			    from: '"app.mantto@gmail.com" <app.mantto@gmail.com>', // sender address
			    to: req.body.email, // list of receivers
			    subject: "Restablecimiento de contraseña", // Subject line
			    text: "Restablecimiento de contraseña", // plain text body
			    html: "<b>Restablecimiento de contraseña</b></br><p>Su codigo es <b>"+resetCode+"</b></p>" // html body
			  });

			  res.send({estilo: 'info', titulo: 'Información', mensaje:'Hemos enviado un código a tu correo.'});
			}
			main().catch(console.error);
    	}

        return database.close();
    }, err => {
        return database.close().then( () => { throw err; } )
    } )
    .catch( err => {
    	console.log(err);
    	res.send({estilo: 'danger', titulo: 'Error', mensaje:'Se produjo un error durante el envío del código.'});
    } );

});

router.post('/RecuperarPassword2', function(req, res){

    var database = new Database();
    var sql = 'CALL SP_RecuperarPassword2(?,?,?,@output)';
    var args = [req.body.email, req.body.password, req.body.resetCode];

    database.query( sql, args )
    .then( rows => {
        var sql = 'SELECT @output AS output';
        return database.query( sql );
    } )
    .then( rows => {
        if(rows[0].output === 0) {
            res.send({estilo: 'warning', titulo: 'Advertencia', mensaje:'El código ingresado no es válido o ha expirado.'});
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
