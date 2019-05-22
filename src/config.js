const config = {
    clients: [ {
        id: 'alexa',
        clientId: 'alexa',
        clientSecret: 'secret',
        grants: [ 'password', 'refresh_token' ],
        redirectUris: [],
    }, {
        id: 'application',
        clientId: 'application',
        clientSecret: 'secret',
        grants: [ 'password', 'refresh_token' ],
        redirectUris: [],
    } ],

    tokens: [],
};

module.exports = config;
