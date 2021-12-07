// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
//Aqui mandamos a llamar los diferentes modulos que contenga push.js
const push = require('./push');

const mensajes = [

  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensaje
router.post('/', function (req, res) {
  
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push( mensaje );

  console.log(mensajes);


  res.json({
    ok: true,
    mensaje
  });
});


// Almacenar la suscripción
// Aqui resibire la suscripcion del usuario y guardar la misma
router.post('/subscribe', (req, res) => {


  const suscripcion = req.body;

  //Este metodo se crea en el modulo de push.js, sirve para agregar
  //la suscripcion
  push.addSubscription( suscripcion );


  res.json('subscribe');

});

// Almacenar la llave publica
router.get('/key', (req, res) => {

  //Aqui resibire la llave publica llamando al metodo push del push.js
  const key = push.getKey();

  //Mandar directamente la llave codificada
  res.send(key);

});


// Envar una notificación PUSH a las personas
// que nosotros queramos
// ES ALGO que se controla del lado del server
router.post('/push', (req, res) => {
  //Cuando llame el push , enviarle nuestro post, nuestra notificacion
  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  };

  //Este metodo se crea en el modulo de push.js, sirve para enviar
  //la suscripcion
  push.sendPush( post );

  res.json( post );

});





module.exports = router;