const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const OAuth2Server = require('oauth2-server');

const model = require('./model');
const middlewares = require('./middlewares');

const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;


const app = express();

// SECTION: Configure OAuth2
app.oauth = new OAuth2Server({
    model: model,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

// SECTION: Configure supporting modules (middlewares) for express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(middlewares.allowCrossDomain);

// SECTION: Prepare functions
const obtainToken = (req,res) => {
    console.log( ' obtaining beaer')
    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.token(request, response)
        .then(function(token) {

            res.json(token);
        }).catch(function(err) {

            res.status(err.code || 500).json(err);
        });
};

const authenticateRequest = (req, res, next) => {

    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.authenticate(request, response)
        .then((token) => {
            next();
        }).catch((err) => {

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

app.get('/secret', authenticateRequest, (req, res) => {
    return res.send('Congrats you are in secret area');
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

