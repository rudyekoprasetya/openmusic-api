//inport file env
require('dotenv').config();

const Hapi = require('@hapi/hapi');

const songs = require('./api/songs');
//database
const SongsService = require('./services/postgres/SongsService');
//import validator Joi
const SongsValidator = require('./validator/songs');

//users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users')

//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications')

const init = async() =>{
	const songService = new SongsService();
	//instance users
	const usersService = new UsersService();
	//instance auth
	const authenticationsService = new AuthenticationsService();

	const server = Hapi.server({
		port:  process.env.PORT,
		host:  process.env.HOST,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	});

	//register plugin
	await server.register([
		{
			plugin: songs,
			options: {
				service: songService,
				validator: SongsValidator
			},
		},
		{
			plugin: users,
			options: {
			  service: usersService,
			  validator: UsersValidator,
			},
		},
		{
			plugin: authentications,
			options: {
			  authenticationsService,
			  usersService,
			  tokenManager: TokenManager,
			  validator: AuthenticationsValidator,
			},
		},
	]);

	await server.start();
	console.log(`Server run at ${server.info.uri}`);

}

init();