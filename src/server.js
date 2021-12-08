//inport file env
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

//users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users')

//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

//playlist
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists')

// playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async() =>{
	const songService = new SongsService();
	//instance users
	const usersService = new UsersService();
	//instance auth
	const authenticationsService = new AuthenticationsService();
	const playlistService = new PlaylistsService();
	const playlistsongsService = new PlaylistSongsService();
	const collaborationsService = new CollaborationsService();

	const server = Hapi.server({
		port:  process.env.PORT,
		host:  process.env.HOST,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	});

	await server.register([
		{
		  plugin: Jwt,
		},
	]);

	//jwt
	server.auth.strategy('openmusic_jwt', 'jwt', {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
		  aud: false,
		  iss: false,
		  sub: false,
		  maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		validate: (artifacts) => ({
		  isValid: true,
		  credentials: {
			id: artifacts.decoded.payload.id,
		  },
		}),
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
		{
			plugin: playlists,
			options: {
			  service: playlistService,
			  validator: PlaylistValidator,
			  playlistvalidator: PlaylistValidator,
			},
		},
		{
		plugin: playlistsongs,
		options: {
			service: playlistsongsService,
			servicePlaylist: playlistService,
			validator: PlaylistSongsValidator,
			},
		},
		{
			plugin: collaborations,
			options: {
			  collaborationsService,
			  playlistService,
			  validator: CollaborationsValidator,
			},
		},
	]);

	await server.start();
	console.log(`Server run at ${server.info.uri}`);

}

init();