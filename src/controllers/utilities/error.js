/**
 * @param {object} body
 * @param {string} property
 * @returns {boolean}
 */
export const missesProperty = ( body, property ) => !Object.prototype
    .hasOwnProperty.call( body, property );

/**
 * @param {object} body
 * @param {Array} property
 * @returns {boolean}
 */
export const missingProperties = ( body, properties ) => {
    for ( let i = 0; i < properties.length; i += 1 ) {
        if ( missesProperty( body, properties[ i ] ) ) return properties[ i ];
    }
    return false;
};

/**
 * @param {object} res
 * @param {string} property
 * @returns {json}
 */
export const sendBadRequestErrorMissingProperty = ( res, property ) => res.status( 400 )
    .json( {
        error: 'Bad Request',
        message: `The request body must contain a ${ property } property`,
    } );

/**
 * @param {object} res
 * @param {string} username
 * @returns {json}
 */
export const sendBadRequestErrorUsernameTaken = ( res, username ) => res.status( 400 )
    .json( {
        error: 'Bad Request',
        message: `The ${ username } is already taken`,
    } );
