const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const model = require('./model');

const app = express();

// SECTION: Configure OAuth2
app.oauth = new OAuth2Server({
    model: model,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

// SECTION: Configure supporting modules for express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SECTION: Prepare functions
const obtainToken = (req,res) => {
    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.token(request, response)
        .then(function(token) {

            res.json(token);
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
};

// SECTION: Misc.
dotenv.config();

// SECTION: route config
app.all('/oauth/token', obtainToken);

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.post('/', (req, res) => {
  return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Froodo backend listening on port ${process.env.PORT}!`),
);

