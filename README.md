# foodoo-backend

## Packages used:
- `express`
- ~~`express-oauth-server`~~ replaced by `oauth2-server` (no further development for express wrapper)
- `dotenv`
- `body-parser`

## Usage of OAuth2
### Obtaining new bearer token
For obtaining a new bearer token only the `password` grant of the [RFC6749](https://tools.ietf.org/html/rfc6749) is implemented. To obtain a new, valid token you have to provide the following information:

###### Body information
- Grant type: String as in RFC6749 defined (currently only `password` implemented)
- Username: Identification (e.g. email) of user that wants to obtain the token
- Password: Password of user

###### Header information
- Authorization: keyword '_Basic_' followed by `clientId:clientSecret` as base64 encoded string
- Content-Type: `application/x-www-form-urlencoded`

### Using token to authenticate
After receiving a new bearer token, it can be included in the header of every request to identify the current user. 

###### Header information
- Authorization: keyword '_Bearer_' followed by `<access-token>` as base64 encoded string

Currently the token includes email and id of a user (at time of creation) which would have to be permanently saved (e.g. db, file, etc.) using `saveToken()`-method.  

## Example of usage
For testing the examples please make sure you have `curl` installed on your machine.

###### Obtaining a new token:
```
curl http://localhost:3000/oauth/token \
	-d "grant_type=password" \
	-d "username=<andrew>" \
	-d "password=<verysecret>" \
	-H "Authorization: Basic YWxleGE6c2VjcmV0" \
	-H "Content-Type: application/x-www-form-urlencoded"
```
Should result in something like this:
```
{
"accessToken":"4ca38497aa7e75b4b144933e6eaf744925b23831", 
"accessTokenExpiresAt":"2019-05 20T11:22:34.292Z", 
"refreshToken":"47780f03558fa30d9d90872a1082795bd8693c67",
"refreshTokenExpiresAt":"2019-06-03T10:22:34.294Z", 
"client":{"id":"alexa"}, 
"user": {"id":"id3009","email":"andre.weinkoetz@tum.de"}
}
```

###### Using token to authenticate:
```
curl http://localhost:3000/secret \
	-H "Authorization: Bearer 4ca38497aa7e75b4b144933e6eaf744925b23831"
```
To receive this:
`Congrats you are in secret area`
