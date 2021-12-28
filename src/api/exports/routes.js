const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/playlist/{plyalistId}',
      handler: handler.postExportPlaylistHandler,
      options: {
        auth: 'openmusic_jwt',
      },
    },
];
   
module.exports = routes;