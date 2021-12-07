
var url = window.location.href;
var swLocation = '/twittor/sw.js';
//serviceWorker Registro
var swReg;

if ( navigator.serviceWorker ) {


    if ( url.includes('localhost') ) {
        swLocation = '/sw.js';
    }

    //Buenas Practicas
    // Registar el serviceWorker cuando el sitio Web ya este cargado
    window.addEventListener('load', function() {
        //El serviceWorker cuando maneje las suscripciones detectar el estado
        //de la misma.
        navigator.serviceWorker.register( swLocation )
        .then( function(reg){

            swReg = reg;
            swReg.pushManager.getSubscription().then( verificaSuscripcion );

        });

    });

}





// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

var btnActivadas    = $('.btn-noti-activadas');
var btnDesactivadas = $('.btn-noti-desactivadas');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});


// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    var data = {
        mensaje: mensaje,
        user: usuario
    };


    fetch('api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    })
    .then( res => res.json() )
    .then( res => console.log( 'app.js', res ))
    .catch( err => console.log( 'app.js error:', err ));



    crearMensajeHTML( mensaje, usuario );

});



// Obtener mensajes del servidor
function getMensajes() {

    fetch('api')
        .then( res => res.json() )
        .then( posts => {

            console.log(posts);
            posts.forEach( post =>
                crearMensajeHTML( post.mensaje, post.user ));


        });


}

getMensajes();



// Detectar cambios de conexión
function isOnline() {

    if ( navigator.onLine ) {
        // tenemos conexión
        // console.log('online');
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'OK!'
        });


    } else{
        // No tenemos conexión
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'OK',
            type: 'warning'
        });
    }

}

window.addEventListener('online', isOnline );
window.addEventListener('offline', isOnline );

isOnline();


// Notificaciones
//Detalle estetico ocultar botones dependiendo el estado de la notificacion
function verificaSuscripcion( activadas ) {

    if ( activadas ) {
        
        btnActivadas.removeClass('oculto');
        btnDesactivadas.addClass('oculto');

    } else {
        btnActivadas.addClass('oculto');
        btnDesactivadas.removeClass('oculto');
    }

}


//Esta funcion lo que hara solo de demostracion, remplazar la new Notification('Hola Mundo! - granted');
// que se encuentra en la funcion "notificarme"
function enviarNotificacion() {

    //Parametros que pueden resivir las notificaciones, las opciones
    const notificationOpts = {
        body: 'Este es el cuerpo de la notificación',
        icon: 'img/icons/icon-72x72.png'
    };

    const n = new Notification('Hola Mundo', notificationOpts);

    //En este evenlistener , escucha el click a la notificacion
    n.onclick = () => {
        console.log('Click');
    };

}


function notificarme() {
    //Verificar que el navegador soporta notificaciones
    if ( !window.Notification ) {
        console.log('Este navegador no soporta notificaciones');
        return;
    }
    //Verificar si el usuario acepto resibir actualizaciones
    if ( Notification.permission === 'granted' ) {
        //Enviar notificacion
        // new Notification('Hola Mundo! - granted');
        enviarNotificacion();

    //Caso contrario preguntar si la notificacion no se ah negado o esta en su estado natural "Default"
    } else if ( Notification.permission !== 'denied' || Notification.permission === 'default' )  {
        //Realiza una petición de permiso al usuario para que en ese dominio 
        //web se puedan mostrar notificaciones 
        Notification.requestPermission( function( permission ) {
            //Visualizar que opcion escogio el usuario
            console.log( permission );

            //Si el usuario acepto los permisos
            if ( permission === 'granted' ) {
                // new Notification('Hola Mundo! - pregunta');
                enviarNotificacion();
            }

        });

    }



}

// notificarme();


// Get Key - Obtener nuestra llave publica
function getPublicKey() {

    // fetch('api/key')
    //     .then( res => res.text())
    //     .then( console.log );

    return fetch('api/key')
        //Extraer la respuesta como un arrayBuffer
        .then( res => res.arrayBuffer())
        // returnar arreglo, pero como un Uint8array, es lo que 
        //necesita la suscripcion
        .then( key => new Uint8Array(key) );


}

// getPublicKey().then( console.log );

//Con el boton de notificacionesDesactivadas al hacer click . suscribir las
//notificaciones
btnDesactivadas.on( 'click', function() {
    //Sino existe el serviceWorker, no hay registro
    if ( !swReg ) return console.log('No hay registro de SW');
    //Si existe, obtener la llave publica
    getPublicKey().then( function( key ) {
        //Esa llave es lo que necesito para crear el registro en el serviceWorker
        swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
        })
        //Cuando obtenemos la suscripcion, nos devuelve una promesa
        .then( res => res.toJSON() )
        .then( suscripcion => {

            // console.log(suscripcion);
            // Hacer posteo de la suscripcion
            fetch('api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( suscripcion )
            })
            .then( verificaSuscripcion )
            .catch( cancelarSuscripcion );


        });


    });


});


function cancelarSuscripcion() {
    //Para poder cancelar la suscripcion, tengo que hacer referencia al registro del service Worker
    //que se hizo en la parte inicial de la app.js, luego viene un pushManager, tiene que ser llamada
    //a la suscripcion actual
    swReg.pushManager.getSubscription().then( subs => {
        //cancelar la suscripcion 
        subs.unsubscribe().then( () =>  verificaSuscripcion(false) );

    });


}

//Se llama cancelarSuscripcion cuando se le da click al botonActivadas notificaciones
btnActivadas.on( 'click', function() {

    cancelarSuscripcion();


});
