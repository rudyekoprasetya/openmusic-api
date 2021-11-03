const routes = (handler) => [
    {
            method: 'POST',
            path: '/playlists',
            handler:handler.postPlaylistHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
    {
            method: 'GET',
            path: '/playlists',
            handler:handler.getPlaylistHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
    {
            method: 'DELETE',
            path: '/playlists/{playlistid}',
            handler:handler.deletePlaylistByIdHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
    {
            method: 'POST',
            path: '/playlists/{playlistid}/songs',
            handler:handler.postSongPlaylistHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
    {
            method: 'GET',
            path: '/playlists/{playlistid}/songs',
            handler:handler.getSongPlaylistHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
    {
            method: 'DELETE',
            path: '/playlists/{playlistid}/songs',
            handler:handler.deleteSongPlaylistByIdHandler,
            options: {
              auth: 'openmusic_jwt',
            },
    },
];

module.exports = routes;