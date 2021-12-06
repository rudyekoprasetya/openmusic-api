const postPlaylistHandlerVar = require('./postPlaylistHandler');
const getPlaylistsHandlerVar = require('./getPlaylistsHandler');
const deletePlaylistHandlerVar = require('./deletePlaylistHandler');
const postPlaylistsongsHandlerVar = require('./postPlaylistsongsHandler');
const getPlaylistsongsHandlerVar = require('./getPlaylistsongsHandler');
const deletePlaylistsongsBySongidHandlerVar = require('./deletePlaylistsongsBySongidHandler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async(server, { service, validator }) => {
        const postPlaylistHandlerRoutes = new postPlaylistHandlerVar(service, validator);
        const getPlaylistsHandlerRoutes = new getPlaylistsHandlerVar(service, validator);
        const deletePlaylistHandlerRoutes = new deletePlaylistHandlerVar(service, validator);
        const postPlaylistsongsHandlerRoutes = new postPlaylistsongsHandlerVar(service, validator);
        const getPlaylistsongsHandlerRoutes = new getPlaylistsongsHandlerVar(service, validator);
        const deletePlaylistsongsBySongidHandlerRoutes = new deletePlaylistsongsBySongidHandlerVar(service, validator);
        server.route(routes(postPlaylistHandlerRoutes, getPlaylistsHandlerRoutes, deletePlaylistHandlerRoutes, postPlaylistsongsHandlerRoutes, getPlaylistsongsHandlerRoutes, deletePlaylistsongsBySongidHandlerRoutes));
    },
};