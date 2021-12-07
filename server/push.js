//Paquete que ya viene en node , me permite grabar
const fs = require('fs');

//Codificar nuestras llaves, mantenerlas cifradas
const urlsafeBase64 = require('urlsafe-base64');


//Asi puedo leer lo que contiene vapid.json
const vapid = require('./vapid.json');

const webpush = require('web-push');

webpush.setVapidDetails(
    //Configuracion, poner un correo valido para estar al tanto de los nuevos cambios de nuestra app
    'mailto:albert.gonzalez0297@gmail.com',
    vapid.publicKey,
    vapid.privateKey
  );



//Cuando se recarge el navegador mantener las suscripciones, se va inicializar
//con el require(), siempre grabar en una base de datos no en un json
let suscripciones = require('./subs-db.json');

//Aqui retornamos nuestra llave publica codifica con el metodo urlsafe-base64
module.exports.getKey = () => {
    return urlsafeBase64.decode( vapid.publicKey );
};


//Tomar las suscripciones, agregarlas a un arreglo de suscripciones 
module.exports.addSubscription = ( suscripcion ) => {

    suscripciones.push( suscripcion );

    //Grabar en un archivo cada suscripcion que el usuario me genere , ya sea 
    //que me las acepta en un nuevo dispositivo o borre chace, esto genera una
    //nueva suscripcion. Hay que almacenar estas suscripciones que sean persistentes
    
    //Nombre del archivo "__dirname" esto me va a tomar todo el Pat hasta la ubicacion 
    //de la instancia de node mas el nombre del archivo , grabaremos en formato json las "suscripciones"
    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones) );

    //Nota en package.json agregar la siguiente linea
    // "dev": "node ./node_modules/nodemon/bin/nodemon.js server/server --ignore 'server/*.json' "
    //Esto es para que ignore cualquier archivo dentro de la carpeta serve, estos archivos no van a reiniciar Node. 
};


module.exports.sendPush = ( post ) => {

    console.log('Mandando PUSHES');

    const notificacionesEnviadas = [];


    suscripciones.forEach( (suscripcion, i) => {


        const pushProm = webpush.sendNotification( suscripcion , JSON.stringify( post ) )
            .then( console.log( 'Notificacion enviada ') )
            .catch( err => {

                console.log('Notificación falló');

                if ( err.statusCode === 410 ) { // GONE, ya no existe
                    suscripciones[i].borrar = true;
                }

            });

        notificacionesEnviadas.push( pushProm );

    });

    Promise.all( notificacionesEnviadas ).then( () => {

        suscripciones = suscripciones.filter( subs => !subs.borrar );

        fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones) );

    });

}

