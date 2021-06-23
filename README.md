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
Primero vamos a generar la siguiente estructura de archivos:<br>

```shell
-- Docker-compose.yml
-- Dockerfile
-- index.ejs
-- package-lock.json
-- package.json
-- home.ejs
-- server.js
-- .env
```
<br>

Ahora vamos a ir completando varios de estos archivos
### Dockerfile

```docker
FROM node:14.16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["bash", "-c","npm install & npm run docker:start"]
```
<br>

### Docker-compose

```docker
version: "3.1"
services:
    app:
        build: .
        volumes:
            - .:/app
            - /app/node_modules
        ports:
            - 3000:3000
        tty: true
```
<br>

### .env

```shell
CLIENT_ID=xxxx
CLIENT_SECRET=xxxx
ACCESS_TOKEN_URI=https://api.intra.42.fr/oauth/token
AUTHORIZATION_URI=https://api.intra.42.fr/oauth
REDIRECT_URI=http://localhost:3000/callback
```
<br>

### index.ejs

```html
<html>
	<head>
		<title>Oauth2</title>
		<meta charset="utf-8">
		<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
		<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
		<link rel="https://github.com/InigoRomero/42ItTest/blob/main/login.css">
		<script src="../login.css"></script>
		<style>
			html {
				background-color: #56baed;
			}
			
			body {
				font-family: "Poppins", sans-serif;
				height: 100vh;
			}
			
			a {
				color: #92badd;
				display:inline-block;
				text-decoration: none;
				font-weight: 400;
			}
			
			h2 {
				text-align: center;
				font-size: 16px;
				font-weight: 600;
				text-transform: uppercase;
				display:inline-block;
				margin: 40px 8px 10px 8px; 
				color: #cccccc;
			}
			
			
			
			/* STRUCTURE */
			
			.wrapper {
				display: flex;
				align-items: center;
				flex-direction: column; 
				justify-content: center;
				width: 100%;
				min-height: 100%;
				padding: 20px;
			}
			
			#formContent {
				-webkit-border-radius: 10px 10px 10px 10px;
				border-radius: 10px 10px 10px 10px;
				background: #fff;
				padding: 30px;
				width: 90%;
				max-width: 450px;
				position: relative;
				padding: 0px;
				-webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
				box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
				text-align: center;
			}
			
			#formFooter {
				background-color: #f6f6f6;
				border-top: 1px solid #dce8f1;
				padding: 25px;
				text-align: center;
				-webkit-border-radius: 0 0 10px 10px;
				border-radius: 0 0 10px 10px;
			}
			
			
			
			/* TABS */
			
			h2.inactive {
				color: #cccccc;
			}
			
			h2.active {
				color: #0d0d0d;
				border-bottom: 2px solid #5fbae9;
			}
			
			
			
			/* FORM TYPOGRAPHY*/
			
			input[type=button], input[type=submit], input[type=reset]  {
				background-color: #56baed;
				border: none;
				color: white;
				padding: 15px 80px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				text-transform: uppercase;
				font-size: 13px;
				-webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
				box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
				-webkit-border-radius: 5px 5px 5px 5px;
				border-radius: 5px 5px 5px 5px;
				margin: 5px 20px 40px 20px;
				-webkit-transition: all 0.3s ease-in-out;
				-moz-transition: all 0.3s ease-in-out;
				-ms-transition: all 0.3s ease-in-out;
				-o-transition: all 0.3s ease-in-out;
				transition: all 0.3s ease-in-out;
			}
			
			input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
				background-color: #39ace7;
			}
			
			input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
				-moz-transform: scale(0.95);
				-webkit-transform: scale(0.95);
				-o-transform: scale(0.95);
				-ms-transform: scale(0.95);
				transform: scale(0.95);
			}
			
			input[type=text] {
				background-color: #f6f6f6;
				border: none;
				color: #0d0d0d;
				padding: 15px 32px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size: 16px;
				margin: 5px;
				width: 85%;
				border: 2px solid #f6f6f6;
				-webkit-transition: all 0.5s ease-in-out;
				-moz-transition: all 0.5s ease-in-out;
				-ms-transition: all 0.5s ease-in-out;
				-o-transition: all 0.5s ease-in-out;
				transition: all 0.5s ease-in-out;
				-webkit-border-radius: 5px 5px 5px 5px;
				border-radius: 5px 5px 5px 5px;
			}
			
			input[type=text]:focus {
				background-color: #fff;
				border-bottom: 2px solid #5fbae9;
			}
			
			input[type=text]:placeholder {
				color: #cccccc;
			}
			
			
			
			/* ANIMATIONS */
			
			/* Simple CSS3 Fade-in-down Animation */
			.fadeInDown {
				-webkit-animation-name: fadeInDown;
				animation-name: fadeInDown;
				-webkit-animation-duration: 1s;
				animation-duration: 1s;
				-webkit-animation-fill-mode: both;
				animation-fill-mode: both;
			}
			
			@-webkit-keyframes fadeInDown {
				0% {
				opacity: 0;
				-webkit-transform: translate3d(0, -100%, 0);
				transform: translate3d(0, -100%, 0);
				}
				100% {
				opacity: 1;
				-webkit-transform: none;
				transform: none;
				}
			}
			
			@keyframes fadeInDown {
				0% {
				opacity: 0;
				-webkit-transform: translate3d(0, -100%, 0);
				transform: translate3d(0, -100%, 0);
				}
				100% {
				opacity: 1;
				-webkit-transform: none;
				transform: none;
				}
			}
			
			/* Simple CSS3 Fade-in Animation */
			@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
			@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
			@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
			
			.fadeIn {
				opacity:0;
				-webkit-animation:fadeIn ease-in 1;
				-moz-animation:fadeIn ease-in 1;
				animation:fadeIn ease-in 1;
			
				-webkit-animation-fill-mode:forwards;
				-moz-animation-fill-mode:forwards;
				animation-fill-mode:forwards;
			
				-webkit-animation-duration:1s;
				-moz-animation-duration:1s;
				animation-duration:1s;
			}
			
			.fadeIn.first {
				-webkit-animation-delay: 0.4s;
				-moz-animation-delay: 0.4s;
				animation-delay: 0.4s;
			}
			
			.fadeIn.second {
				-webkit-animation-delay: 0.6s;
				-moz-animation-delay: 0.6s;
				animation-delay: 0.6s;
			}
			
			.fadeIn.third {
				-webkit-animation-delay: 0.8s;
				-moz-animation-delay: 0.8s;
				animation-delay: 0.8s;
			}
			
			.fadeIn.fourth {
				-webkit-animation-delay: 1s;
				-moz-animation-delay: 1s;
				animation-delay: 1s;
			}
			
			/* Simple CSS3 Fade-in Animation */
			.underlineHover:after {
				display: block;
				left: 0;
				bottom: -10px;
				width: 0;
				height: 2px;
				background-color: #56baed;
				content: "";
				transition: width 0.2s;
			}
			
			.underlineHover:hover {
				color: #0d0d0d;
			}
			
			.underlineHover:hover:after{
				width: 100%;
			}
			
			
			
			/* OTHERS */
			
			*:focus {
				outline: none;
			} 
			
			#icon {
				width:60%;
			}
		</style>
	</head>
	<body>
		<div class="content text-center">
			<h1>42 Espía</h1>
			<img src="https://raw.githubusercontent.com/InigoRomero/42ItTest/main/nodeJS/captures/icon.png?token=AK5DQM5DJC3HF4ZI6JZM4STATFGJ4" widt=300 height=200>
			<p>by Iromero-</p>
			<br></br>
		</div>
		<center>
			<div class="justify-content-center fadeInDown">
				<div id="formContent">
					<div class="fadeIn first">
					<img src="https://raw.githubusercontent.com/InigoRomero/42ItTest/main/42Icon.jpeg?token=AK5DQMZPDGPOKG2TZ3CF6XDATK74Y" id="icon" alt="User Icon" />
					</div>
					<form>
						<a href="your_url">Log in</button></a></br></br>
					</form>
					<div id="formFooter">
					<p class="underlineHover"> Entra si quieres saber todo lo que 42 sabe de tí </p>
					</div>
				</div>
			</div>
		</center>
	</body>
</html>
```
Perdonar por todo ese css en el header jeje
<br>

Ahora toca cambiar en index.ejs , el enlace que redirije a 42 para que el usuario se autentifique, con el que se te ha proporcionado al crear la aplicación en la intra.
```html
<a href="your_url">Log in</button></a></br></br>
```

Acontinuación vamos a crear un servidor que lo único que haga sea cargar este index que acabamos de rellenar.

```js
data: {
  access_token: 'xxxx',
  token_type: 'bearer',
  expires_in: 7200,
  refresh_token: 'xxxx',
  scope: 'public',
  created_at: 1624471209
}
```


