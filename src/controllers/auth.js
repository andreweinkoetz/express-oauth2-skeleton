const { obtainToken } = require( '../middlewares' );
const UserModel = require( '../models/user' );
const TokenModel = require( '../models/token' );

const register = ( req, res ) => {
    const user = req.body;
    user.id = user.username;
    UserModel.create( user ).then( ( u ) => {
        res.status( 200 ).json( u );
    } );
};

const me = ( req, res ) => {
    const { accessToken } = req.body.token.token;

    TokenModel.findOne( { accessToken } ).populate( 'user' ).then( ( token ) => {
        res.status( 200 ).json( token.user );
    } );
};

module.exports = {
    obtainToken,
    register,
    me,
};
