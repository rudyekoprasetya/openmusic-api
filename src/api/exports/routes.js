const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/playlist/{playlistId}',
      handler: handler.postExportSongsHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
];
   
module.exports = routes;