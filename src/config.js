const config = {
    clients: [ {
        id: 'alexa',
        clientId: 'alexa',
        clientSecret: process.env.ALEXA_CLIENT_SECRET,
        grants: [ 'password', 'refresh_token', 'authorization_code' ],
        redirectUris: [ 'https://www.google.de' ],
    }, {
        id: 'application',
        clientId: 'application',
        clientSecret: process.env.APP_CLIENT_SECRET,
        grants: [ 'password', 'refresh_token', 'authorization_code' ],
        redirectUris: [],
    } ],

    tokens: [],
};

module.exports = config;
