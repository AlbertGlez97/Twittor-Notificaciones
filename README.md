# Notas:

Este es un pequeño servidor de express listo para ejecutarse y servir la carpeta public en la web.

Recuerden que deben de reconstruir los módulos de node con el comando

```
npm install
```

Luego, para correr en producción
```
npm start
```

Para correr en desarrollo
```
npm run dev
```

Este paquete nos permite generar un juego de llaves (publica y privada)
```
npm i web-push
```
Nota - Cada ves que generemos nuevas llaves, entonces todas las suscripciones dejan de funcionar por lo cual hay que tener cuidado, no es algo que podamos ejecutar cada que iniciemos el servidor.
Este comando hace que generemos nuestras llaves cuando lo necesitemos, lo introduciremos en el package.json
```
"generate-vapid": "node ./node_modules/web-push/src/cli.js generate-vapid-keys --json > server/vapid.json"
```
Este comando lo que hara es crear nuestro juego de llaves , tanto la publica y la privada. Las guardara en un json que se llamara "vapid"

Este paquete nos permite codificar nuestras llaves como una cadena URL Safe Base64
```
npm i urlsafe-base64
```

# Introduccion al envio de Push Notifications

Es una manera que tiene un servidor para mandar una notificacion en tu dispositivo, como las notificaciones de facebook.
```
Push Server
```
Es el servidor encargado de manetener y manejar las suscripciones a estas push notifications. 

Estos son los pasos necesarios para enviar las notificaciones

Primer paso es referente al permiso, hay tres estados 
    - Granted (Acepto las notificaciones el usuario)
    - Denied (No quiere resivir el usuario notificaciones , pero lo que si se puede hacer, es detectar que estan bloqueadas y solicitar al usuario manualmente que las active porque son necesarias)
    - Default  (Hay usuarios que no quieren que les esten preguntando , aceptan todas o rechazan todas, no podemos hacer nada mas que saber el estado en el que se encuentran)

Segundo paso es referente a la suscripcion (Cuando ya tenemos acceso a mandarle notificaciones al usuario)

En este paso lamentablemente tenemos que pasar por un servicio de terceros, que normalmente es ofrecido por el mismo navegador web, en caso de google crome y navegadores android se utiliza "Firebase".


