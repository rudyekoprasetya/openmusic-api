const ClientError = require("../../exceptions/ClientError");

class PlaylistHandler {
    constructor(service, validator) {
        this._service=service;
        this._validator=validator;

        this.postPlaylistHandler=this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler=this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler=this.deletePlaylistByIdHandler.bind(this);

    }

    async postPlaylistHandler(req, h) {
        try {
            this._validator.validatePlaylistPayload(req.payload);
            const { name } = req.payload;
            const { id: credentialId } = req.auth.credentials;
            const playlistId = await this._service.addPlaylist( name, credentialId);

            const res = h.response({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });
            return res.code(201);
        } catch(error) {
            if (error instanceof ClientError) {
                const res = h.response({
                  status: 'fail',
                  message: error.message,
                });
                res.code(error.statusCode);
                return res;
            }
        
            const res = h.response({
                status: 'error',
                message: 'Terjadi server error',
            });
            res.code(500);
            return console.error(error);
        }
    }

    async getPlaylistHandler(req, h) {
        try {
          const { id: credentialId } = req.auth.credentials;
          const data = await this._service.getPlaylist(credentialId);
    
          return {
            status: 'success',
            data: {
              // playlists,
              playlists:data.map((n)=>({
                id:n.id,
                name:n.name,
                username:n.username
              }))

            },
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const res = h.response({
              status: 'fail',
              message: error.message,
            });
            res.code(error.statusCode);
            return res;
          }
    
          const res = h.response({
            status: 'error',
            message: 'Terjadi server error',
          });
          res.code(500);
          return console.error(error);
        }
    }

    async deletePlaylistByIdHandler(req, h) {
        try {
          const { playlistId } = req.params;
          const { id: credentialId } = req.auth.credentials;
    
          await this._service.verifyPlaylistOwner(playlistId, credentialId);
          await this._service.deletePlaylist(playlistId);
    
          return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
          };
        } catch (error) {
          if (error instanceof ClientError) {
            const res = h.response({
              status: 'fail',
              message: error.message,
            });
            res.code(error.statusCode);
            return res;
          }
    
          const res = h.response({
            status: 'error',
            message: 'Terjadi server error',
          });
          res.code(500);
          console.error(error);
          return res;
        }
    }
    
}

module.exports=PlaylistHandler;