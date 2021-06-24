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
	if (req.session.refresh)
	{
		axios({
			method: 'post',
			url: process.env.ACCESS_TOKEN_URI,
			headers: {'Content-Type': 'application/json'}, 
			data: {
		  'grant_type': 'refresh_token',
		  'refresh_token': req.session.refresh,
		  'client_id': process.env.CLIENT_ID,
		  'client_secret': process.env.CLIENT_SECRET
			}
		 })
		.then(function (response) {
			req.session.refresh = response.data.refresh_token;
			req.session.token = response.data.access_token;
			req.session.expires_in = response.data.expires_in;
			req.session.created_at = response.data.created_at;
			res.redirect('/request');
		})
		.catch(function (error) {
			res.redirect('/');
		});
	}
	else
		res.render(path.join(__dirname + '/index.ejs'));
});

app.listen(3000);
