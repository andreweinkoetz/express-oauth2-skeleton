/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const lodash = require( 'lodash' );
const bcrypt = require( 'bcrypt' );

const UserModel = require( './models/user' );
const ClientModel = require( './models/client' );
const TokenModel = require( './models/token' );
const CodeModel = require( './models/code' );


const getUser = async ( username, password ) => {
    console.log( 'getUser-function called' );

    const user = await UserModel.findOne( { username } ).exec();
    const validPassword = user && bcrypt.compareSync( password, user.password );
    user.password = undefined;
    return validPassword ? user : undefined;
};

const getClient = async ( clientId, clientSecret ) => {
    console.log( 'getClient-function called' );

    // Checks if there's a clientId with matching clientSecret.
    const client = await ClientModel.findOne( { clientId } ).exec();
    if ( clientSecret ) {
        return client && ( client.clientSecret === clientSecret ) ? client : undefined;
    }
    return client;
};

const saveToken = ( token, client, user ) => {
    console.log( 'saveToken-function called' );

    const savingToken = lodash.cloneDeep( token );

    TokenModel.create( savingToken ).then( ( savedToken ) => {
        UserModel.findOne( { username: user.username } ).exec()
            .then( u => u._id )
            .then( ( userId ) => {
                ClientModel.findOne( { id: client.id } ).then( ( c ) => {
                    /* eslint-disable-next-line no-param-reassign */
                    savedToken.user = user._id;
                    /* eslint-disable-next-line no-param-reassign */
                    savedToken.client = client._id;
                    savedToken.save();
                } );
            } );
    } );

    savingToken.user = user;
    savingToken.client = client;

    return savingToken;
};

const getAccessToken = async ( accessToken ) => {
    console.log( 'getAccessToken called' );

    const token = await TokenModel.findOne( { accessToken } ).populate( 'user' ).exec();

    token.user.password = undefined;

    return token;
};

const getAuthorizationCode = async ( authorizationCode ) => {
    console.log( 'getAuthorizationCode called' );

    const code = await CodeModel.findOne( { authorizationCode } ).populate( 'client' ).exec();

    return code;
};

const saveAuthorizationCode = async ( code, client, user ) => {
    console.log( 'saveAuthorizationCode called' );

    const savingCode = lodash.cloneDeep( code );
    savingCode.client = client._id;
    savingCode.user = user._id;

    CodeModel.create( savingCode );

    return code;
};

const getRefreshToken = async ( refreshToken ) => {
    console.log( 'getRefreshToken called' );

    // Check if this refresh token exists.
    const token = await TokenModel.findOne( { refreshToken } ).populate( 'user' ).populate( 'client' ).exec();

    return ( new Date() > token.refreshTokenExpiresAt ) ? undefined : token;
};

const revokeAuthorizationCode = async ( authorizationCode ) => {
    console.log( 'revokeAuthorizationCode called' );
    const removedCode = await CodeModel.findOneAndDelete( { authorizationCode } ).exec();

    return !!removedCode;
};

const revokeToken = async ( token ) => {
    console.log( 'RevokeToken called' );

    const removedToken = await TokenModel
        .findOneAndDelete( { refreshToken: token.refreshToken } ).exec();

    return !!removedToken;
};


module.exports = {
    getUser,
    getClient,
    saveToken,
    saveAuthorizationCode,
    getAccessToken,
    getRefreshToken,
    revokeToken,
    getAuthorizationCode,
    revokeAuthorizationCode,
};
