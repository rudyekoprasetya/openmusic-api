//inport file env
require('dotenv').config();

const Hapi = require('@hapi/hapi');

const songs = require('./api/songs');
//database
const SongsService = require('./services/postgres/SongsService');
//import validator Joi
const SongsValidator = require('./validator/songs');

const init = async() =>{
	const songService = new SongsService();

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
	await server.register({
		plugin: songs,
		options: {
			service: songService,
			validator: SongsValidator
		}
	});

	await server.start();
	console.log(`Server run at ${server.info.uri}`);

}

init();