![guapo](https://raw.githubusercontent.com/InigoRomero/LO-QUE-IROMERO--SABE-LA-PI-A-LO-SABE-/main/resources/pin%CC%83aSabe.png)
<br><br>
# INTRODUCCIÓN
<br>
En este repositorio , se aprendera a como crear una aplicación web con Node JS y la API de 42.<br>
Todo este código ira acompañado con explicaciones durante el workshop.

## Que necesitas ?
- Un ordenador
- Docker
- Tener una aplicación de 42 creada. (Settings -> API -> REGISTER A NEW APP)
- En tu aplicación poner como Redirect URI = http://localhost:3000/callback
- Conocer la diferencia entre Backend y Frontend
<br><br>
## Que vas a hacer ?
### Login
![Login](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Login.png)
### Auth
![auth](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Auth.png)
### Home
![home](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Home.png)
![home](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Home2.png)
<br>
<br>
## Puntos clave de la aplicación ?<br>
Toda aplicación que autentifique con Oauth2, va a necesitar los siguientes puntos:
- Un FrontEnd, con un boton que cuando cliques te rediridija a 42 (al enlace que te dan, al crear la aplicación).
- Cuando el usuario se autorize , le redirigirá automáticamente al enlace que has puesto en la Redirect URI en los ajustes de tu aplicación.
- Un Backend, que cuando detecte una llamada al path "/callback" (enrutamiento), llame a una función, que se encargara de conseguir el token(controlador).
- En esta función deberas coger el parametro de la url CODE, con el cual podras llamar a la API y obtener el token, para poder hacer llamadas.

## Que vas a utilizar ?
- Node JS (Lenguaje de programación)
- Express (Framework para crear aplicaciones web y API)
- axios (librería que nos permite hacer peticiones HTTP a un servidor)
- client-oauth2 (Librería para fazilitarnos la autentificación con la API de 42)
- dotenv (Librería para cargar variables de entorno)
- ejs (Embedded JavaScript templates)
- express-session (librería para crear sesiones)
<br><br>

# PRACTICA
<br>
