const routes = (deleteSongByIdHandler, getSongByIdHandler, getSongsHandler, postSongHandler, putSongByIdHandler) => [
{
    method: 'POST',
    path: '/songs',
    handler: postSongHandler.postSongHandlerAsync,
},
{
    method: 'GET',
    path: '/songs',
    handler: getSongsHandler.getSongsHandlerAsync,
},
{
    method: 'GET',
    path: '/songs/{id}',
    handler: getSongByIdHandler.getSongByIdHandlerAsync,
},
{
    method: 'PUT',
    path: '/songs/{id}',
    handler: putSongByIdHandler.putSongByIdHandlerAsync,
},
{
    method: 'DELETE',
    path: '/songs/{id}',
    handler: deleteSongByIdHandler.deleteSongByIdHandlerAsync,
},
];

module.exports = routes;