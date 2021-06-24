![guapo](https://raw.githubusercontent.com/InigoRomero/LO-QUE-IROMERO--SABE-LA-PI-A-LO-SABE-/main/resources/pin%CC%83aSabe.png)
<br><br>
# INTRODUCCIÓN
<br>
En este repositorio , se aprendera a como crear una aplicación web con Node JS y la API de 42.<br>
Todo este código ira acompañado con explicaciones durante el workshop.

## ¿Qué necesitas ?
- Un ordenador
- Docker
- Tener una aplicación de 42 creada. (Settings -> API -> REGISTER A NEW APP)
- En tu aplicación poner como Redirect URI = http://localhost:3000/callback
- Conocer la diferencia entre Backend y Frontend
<br><br>
## ¿Qué vas a hacer ?
### Login
![Login](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Login.png)
### Auth
![auth](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Auth.png)
### Home
![home](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Home.png)
![home](https://github.com/InigoRomero/42ItTest/blob/main/nodeJS/captures/Home2.png)
<br>
<br>
## Puntos clave de la aplicación <br>
Toda aplicación que autentifique con Oauth2, va a necesitar los siguientes puntos:
- Un FrontEnd, con un boton que cuando cliques te rediridija a 42 (al enlace que te dan, al crear la aplicación).
- Cuando el usuario se autorize , le redirigirá automáticamente al enlace que has puesto en la Redirect URI en los ajustes de tu aplicación.
- Un Backend, que cuando detecte una llamada al path "/callback" (enrutamiento), llame a una función, que se encargara de conseguir el token(controlador).
- En esta función deberas coger el parametro de la url CODE, con el cual podras llamar a la API y obtener el token, para poder hacer llamadas.

## ¿Qué vas a utilizar ?
- Node JS (Lenguaje de programación)
- Express (Framework para crear aplicaciones web y API)
- axios (librería que nos permite hacer peticiones HTTP a un servidor)
- client-oauth2 (Librería para fazilitarnos la autentificación con la API de 42)
- dotenv (Librería para cargar variables de entorno)
- express-session (librería para crear sesiones)
- ejs (Embedded JavaScript templates)
<br><br>

# PRACTICA
<br>
Primero vamos a generar la siguiente estructura de archivos:<br>

```shell
-- Docker-compose.yml
-- Dockerfile
-- server.js
-- index.ejs
-- home.ejs
-- .env
-- package-lock.json // se genera automáticamente al instalar librerias (npm install xx)
-- package.json // se genera automáticamente al iniciar npm (npm init)
```
<br>

Ahora vamos a ir completando varios de estos archivos, para poder lanzar nuestra aplicación
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

Acontinuación vamos a rellenar de los package:
[package.json](https://github.com/InigoRomero/LO-QUE-IROMERO--SABE-LA-PI-A-LO-SABE-/blob/main/nodeJS/package.json) <br>
[package-lock.json](https://github.com/InigoRomero/LO-QUE-IROMERO--SABE-LA-PI-A-LO-SABE-/blob/main/nodeJS/package-lock.json) <br>

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

### server.js

```shell
var express = require('express'),
		session = require('express-session'),
		app = express(),
		path = require('path');

require('dotenv').config()

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
		res.render(path.join(__dirname + '/index.ejs'));
});

app.listen(3000);

```
<br>

Con esto ya podemos hacer docker-compose up y veremos que si ponemos http://localhost:3000/ en nuestro navegador, podremos ya ver el login.<br>

### Repasemos. ¿Qué tenemos hasta ahora? 🤔

Tiempo de repaso <br>
Tiempo de repaso <br>
Tiempo de repaso <br>
Tiempo de repaso <br>
Tiempo de repaso <br>
Tiempo de repaso <br>
Tiempo de repaso <br>
<br>

### Siguiente paso 🧠<br>
Tenemos que conseguir que cuando el usuario se autorize en 42 y 42 lo redirija a nuestra aplicación, ejecute una función la cual cogerá la variable code de la url.<br> (ej: http://localhost:3000/callback?code=c9248d385e086dd4389b1f4466a2bba4a956fe1a803650e66d2867a2d4004164 ).<br>
Entonces con este código, haremos una llamada a 42 (https://api.intra.42.fr/oauth/token), en la cual le pasaremos el código que hemos conseguido y 42 nos devolvera la siguiente información: <br>

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
<br><br>
Añadimos el siguiente código a server.js <br>

### server.js
```js
/cargamos libreria
var ClientOAuth2 = require('client-oauth2')
//iniciamos libreria Oauth2
var auth = new ClientOAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  accessTokenUri: process.env.ACCESS_TOKEN_URI,
  authorizationUri: process.env.AUTHORIZATION_URI,
  redirectUri: process.env.REDIRECT_URI
})

app.get('/callback', function (req, res) {

	auth.code.getToken(req.originalUrl).then(function (user) {
		user.refresh().then(function (updatedUser) {
		  req.session.refresh = updatedUser.data.refresh_token;
		  req.session.token = updatedUser.accessToken;
		  req.session.expires_in = updatedUser.data.expires_in;
		  req.session.created_at = updatedUser.data.created_at;
		  console.log(pdatedUser.data);
		})
	})
	
});
``` 
<br><br>

Debería quedaros un código así:
```js
var express = require('express'),
		session = require('express-session'),
		app = express(),
		path = require('path');

app.use(session({
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: false
}));
var ClientOAuth2 = require('client-oauth2')
require('dotenv').config()

var auth = new ClientOAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  accessTokenUri: process.env.ACCESS_TOKEN_URI,
  authorizationUri: process.env.AUTHORIZATION_URI,
  redirectUri: process.env.REDIRECT_URI
})

app.set('view engine', 'ejs');

app.get('/callback', function (req, res) {

	auth.code.getToken(req.originalUrl).then(function (user) {
		// Refresh the current users access token.
		user.refresh().then(function (updatedUser) {
		  req.session.refresh = updatedUser.data.refresh_token;
		  req.session.token = updatedUser.accessToken;
		  req.session.expires_in = updatedUser.data.expires_in;
		  req.session.created_at = updatedUser.data.created_at;
		  console.log(updatedUser.data);
		})
	})
});

app.get('/', function (req, res) {
	res.render(path.join(__dirname + '/index.ejs'));
});

app.listen(3000);
```
<br><br>
### Siguiente paso 🧠<br>
Vamos a crear la vista donde mostraremos los datos
## home.ejs

```html
<html>
	<head>
		<title>Oauth2</title>
		<meta charset="utf-8">
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
		<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<style>
			table {
				font-family: arial, sans-serif;
				border-collapse: collapse;
				width: 100%;
			}
			
			td, th {
				border: 1px solid #dddddd;
				text-align: left;
				padding: 8px;
			}
			
			tr:nth-child(even) {
				background-color: #dddddd;
			}
		  </style>
	</head>
	<body>
		<div class="content text-center">
			<h1>¿42 Nos espía?</h1>
			<img src="https://raw.githubusercontent.com/InigoRomero/42ItTest/main/nodeJS/captures/icon.png?token=AK5DQM5DJC3HF4ZI6JZM4STATFGJ4" widt=160 height=90>
			<p>by Iromero-</p>
		</div>
		<div class="row">
			<div class="col-md-3"></div>
			<div class="col-md-6 content text-center">
				<h3>¿Quieres saberlo todo de otro estudiante?</h3>
				<form role="form" method="post" action="/request">
					<div class="form-group">
						<input type="text" class="form-control" name="request" id="request">
					</div>
					<button type="submit" class="btn btn-default">Buscar</button>
				</form>
			</div>
			<div class="col-md-3"></div>
		</div>
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-2">
				<h3>SOBRE TÍ</h3>
				<img src="<%= me.image_url %>" alt="your photo" width="200" height="300"> </img>
			</div>
			<div class="col-md-3">
				<br></br>
				<table>
					<tr> <td>id</td> <td><%= me.id %></td> </tr>
					<tr> <td>email</td> <td><%= me.email %> </td> </tr>
					<tr> <td>login</td> <td><%= me.login %></td>  </tr>
					<tr> <td>first_name</td> <td><%= me.first_name %></td> </tr>
					<tr> <td>last_name</td> <td><%= me.last_name %></td> </tr>
					<tr> <td>usual_first_name</td> <td><%= me.usual_first_name %></td> </tr>
					<tr> <td>url</td> <td> <a href="https://profile.intra.42.fr/users/<%= me.login %>" target="blanck">Intra</a></td> </tr>
					<tr> <td>phone</td> <td><%= me.phone %></td> </tr>
				</table>
			</div>
			<div class="col-md-3">
				<br></br> 
				<table>
					<tr> <td>displayname </td> <td><%= me.displayname %></td> </tr>
					<tr> <td>usual_full_name </td> <td><%= me.usual_full_name %></td> </tr>
					<tr> <td>correction_point </td> <td><%= me.correction_point %></td> </tr>
					<tr> <td>pool_month </td> <td><%= me.pool_month %></td> </tr>
					<tr> <td>pool_year </td> <td><%= me.pool_year %></td> </tr>
					<tr> <td>location </td> <td><%= me.location %></td> </tr>
					<tr> <td>wallet </td> <td><%= me.wallet %></td> </tr>
				</table>
			</div>
		</div>
		<br></br>
		<% for (var i = 0; i < me.cursus_users.length; i++) { %>
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-2">
					<h4>CURSUS <%= me.cursus_users[i].cursus.name %></h4>
					<table>
						<tr><td>Level</td> <td><%= me.cursus_users[i].level %></td></tr>
						<tr><td>begin_at</td> <td><%= me.cursus_users[i].begin_at %></td></tr>
						<tr><td>grade</td> <td><%= me.cursus_users[i].grade %></td></tr>
						<tr><td>blackholed_at</td> <td><%= me.cursus_users[i].blackholed_at %></td></tr>
					</table>
				</div>
				<div class="col-md-4">
					<h4>SKILLS <%= me.cursus_users[i].cursus.name %></h4>
					<table>
						<tr>
							<th>Name</th>
							<th>Level</th>
						</tr>
						<% for (var x = 0; x < me.cursus_users[i].skills.length; x++) { %>
							<tr>
								<td> <%= me.cursus_users[i].skills[x].name %> </td>
								<td> <%= me.cursus_users[i].skills[x].level %> </td>
							</tr>
						<% } %>
					</table>
				</div>
			</div>
		<% } %>
		<div class="row">
			<div class="col-md-1"></div>
			<div class="col-md-3">
				<h3>Tus Proyectos</h3>
				<table>
					<tr>
						<th>Name</th>
						<th>Final Mark</th>
						<th>Status</th>
					</tr>
					<% for (var i = 0; i < me.projects_users.length; i++) { %>
						<tr>
							<td> <%= me.projects_users[i].project.name %> </td>
							<td> <%= me.projects_users[i].final_mark %> </td> 
							<td> <%= me.projects_users[i].status %> </td> 
						</tr>
					<% } %>
				</table>
			</div>
			<div class="col-md-7">
				<h3>Tus Logros</h3>
				<table>
					<tr>
						<th>Logo</th>
						<th>name</th>
						<th>description</th>
						<th>tier</th>
						<th>kind</th>
					</tr>
					<% for (var i = 0; i < me.achievements.length; i++) { %>
						<tr>
							<td> <img src="https://profile.intra.42.fr/<%= me.achievements[i].image %>" alt="logo" width="100" height="70"> </img> </td>
							<td> <%= me.achievements[i].name %> </td>
							<td> <%= me.achievements[i].description %> </td>
							<td> <%= me.achievements[i].tier %> </td>
							<td> <%= me.achievements[i].kind %> </td>
						</tr>
					<% } %>
				</table>
			</div>
		</div>
		 <p><%= JSON.stringify(me) %></p> 
	</body>
</html>
```
<br><br>

## Últismos pasos :( <br>
Vamos a crear una función, que mirando en la sesión el token, vamos a hacer una llamada a la API de 42 pidiendole todos los datos de la persona que se ha logeado.<br>
Para ello primero vamos a modificar dos funciones que ya tenemos existentes

## app.get('/', function (req, res)

```js
app.get('/', function (req, res) {
	if (req.session.token)
		res.redirect('/request');
	else
		res.render(path.join(__dirname + '/index.ejs'));
});
```
<br><br>
## app.get('/callback', function (req, res)

```js
app.get('/callback', function (req, res) {

	auth.code.getToken(req.originalUrl).then(function (user) {
		// Refresh the current users access token.
		user.refresh().then(function (updatedUser) {
		  req.session.refresh = updatedUser.data.refresh_token;
		  req.session.token = updatedUser.accessToken;
		  req.session.expires_in = updatedUser.data.expires_in;
		  req.session.created_at = updatedUser.data.created_at;
		  res.redirect('/request');
		})
	})
});
```
<br><br>
 Añadimos nuestra última función:<br>
 
 ```js
app.get('/request', async function (req, res) {
	if (!req.session.token)
		res.redirect('/');
	else
	{
		var token = req.session.token;
		axios.get("https://api.intra.42.fr/v2/me", {
			headers: {
			  'Authorization': 'Bearer ' + token
			}
		  }).then(function (response) {
			res.render(path.join(__dirname + '/home.ejs'), {me: response.data, req_ret: ''});
		  })
		  .catch(function (error) { 
			  	res.render(path.join(__dirname + '/index.ejs'), {me: 'Bad request.', req_ret: ''});
		  });
	}
});
```
<br><br>
Este debería ser el código FINAL

 ```js
var express = require('express'),
		session = require('express-session'),
		app = express(),
		path = require('path');

app.use(session({
	secret: '1234567890QWERTY',
	resave: true,
	saveUninitialized: false
}));
const axios = require('axios');
var ClientOAuth2 = require('client-oauth2')
require('dotenv').config()

var auth = new ClientOAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  accessTokenUri: process.env.ACCESS_TOKEN_URI,
  authorizationUri: process.env.AUTHORIZATION_URI,
  redirectUri: process.env.REDIRECT_URI
})

app.set('view engine', 'ejs');

app.get('/callback', function (req, res) {

	auth.code.getToken(req.originalUrl).then(function (user) {
		// Refresh the current users access token.
		user.refresh().then(function (updatedUser) {
		  req.session.refresh = updatedUser.data.refresh_token;
		  req.session.token = updatedUser.accessToken;
		  req.session.expires_in = updatedUser.data.expires_in;
		  req.session.created_at = updatedUser.data.created_at;
		  res.redirect('/request');
		})
	})
});

app.get('/request', async function (req, res) {
	if (!req.session.token)
		res.redirect('/');
	else
	{
		var token = req.session.token;
		axios.get("https://api.intra.42.fr/v2/me", {
			headers: {
			  'Authorization': 'Bearer ' + token
			}
		  }).then(function (response) {
			res.render(path.join(__dirname + '/home.ejs'), {me: response.data, req_ret: ''});
		  })
		  .catch(function (error) { 
			  	res.render(path.join(__dirname + '/index.ejs'), {me: 'Bad request.', req_ret: ''});
		  });
	}
});

app.get('/', function (req, res) {
	if (req.session.token)
		res.redirect('/request');
	else
		res.render(path.join(__dirname + '/index.ejs'));
});

app.listen(3000);
```
<br><br>
Y siempre que queramos lanzar esto de nuevo, docker-compose up y abrir en el navegador http://localhost:3000/
# Recursos y otras aplicaciones hechas con la API de 42
<br>

- **NodeJS** -> (ejemplo hecho aquí) https://github.com/InigoRomero/LO-QUE-IROMERO--SABE-LA-PI-A-LO-SABE-/tree/main/nodeJS
- **NodeJS + ReactJS** -> https://github.com/InigoRomero/42Calculator
- **pyhton + Django** -> https://github.com/InigoRomero/42ItTest/tree/main/pyhtonDjango
- **rubyOnRails** -> https://github.com/InigoRomero/42ItTest/tree/main/rubyOn
- **PHP + Laravel** -> https://github.com/InigoRomero/42ItTest/tree/main/laravelPHP
- **Scripts en ruby** -> https://github.com/InigoRomero/42ApiScript

 

