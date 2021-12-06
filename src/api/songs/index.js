const deleteSongByIdHandlerVar = require('./deleteSongByIdHandler');
const getSongByIdHandlerVar = require('./getSongByIdHandler');
const getSongsHandlerVar = require('./getSongsHandler');
const postSongHandlerVar = require('./postSongHandler');
const putSongByIdHandlerVar = require('./putSongByIdHandler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const deleteSongByIdHandlerServer = new deleteSongByIdHandlerVar(service, validator);
    const getSongByIdHandlerServer = new getSongByIdHandlerVar(service, validator);
    const getSongsHandlerServer = new getSongsHandlerVar(service, validator);
    const postSongHandlerServer = new postSongHandlerVar(service, validator);
    const putSongByIdHandlerServer = new putSongByIdHandlerVar(service, validator);
    server.route(routes(deleteSongByIdHandlerServer, getSongByIdHandlerServer, getSongsHandlerServer, postSongHandlerServer, putSongByIdHandlerServer));
  },
};
