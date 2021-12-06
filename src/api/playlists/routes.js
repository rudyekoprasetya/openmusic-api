const routes = (postPlaylistHandler, getPlaylistsHandler, deletePlaylistHandler, postPlaylistsongsHandler, getPlaylistsongsHandler, deletePlaylistsongsBySongidHandler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: postPlaylistHandler.postPlaylistHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: getPlaylistsHandler.getPlaylistsHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: deletePlaylistHandler.deletePlaylistHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: postPlaylistsongsHandler.postPlaylistsongsHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: getPlaylistsongsHandler.getPlaylistsongsHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: deletePlaylistsongsBySongidHandler.deletePlaylistsongsBySongidHandlerAsync,
        options: {
            auth: 'playlists_jwt',
        },
    },
];

module.exports = routes;