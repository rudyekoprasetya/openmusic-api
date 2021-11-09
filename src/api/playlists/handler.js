const ClientError = require("../../exceptions/ClientError");

class PlaylistHandler {
    constructor(service, validator, playlistsongvalidator) {
        this._service=service;
        this._validator=validator;
        this._playlistsongvalidator=playlistsongvalidator;

        this.postPlaylistHandler=this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler=this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler=this.deletePlaylistByIdHandler.bind(this);
        this.postSongPlaylistHandler=this.postSongPlaylistHandler.bind(this);
        this.getSongPlaylistHandler=this.getSongPlaylistHandler.bind(this);
        this.deleteSongPlaylistByIdHandler=this.deleteSongPlaylistByIdHandler.bind(this);
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
              // playlist,
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
          const { id:credentialId } = req.auth.credentials;
    
        //   await this._service.playlistVerifyService(playlistId, userId);
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

    async postSongPlaylistHandler(req, h) {
        try {
            this._playlistsongvalidator.validatePlaylistSongPayload(req.payload);
            const { songId } = req.payload;
            const { playlistId } = req.params;
            const { id:credentialId } = req.auth.credentials;
      
            // await this._playlistService.verifyPlaylistAccess(playlistId, userId);
            // await this._songService.verifySongService(songId);
            await this._service.addSongToPlaylist({ playlistId, songId });
      
            const res = h.response({
              status: 'success',
              message: 'Lagu berhasil ditambahkan ke playlist',
            });
            return res.code(201);
        } catch (error) {
            if (error instanceof ClientError) {
              const res = h.response({
                status: 'fail',
                message: error.message,
              });
              return res.code(error.statusCode);
            }
      
            const res = h.response({
              status: 'error',
              message: 'Terjadi server error',
            });
            console.warn(error);
            return res.code(500);
        }
    }

    async getSongPlaylistHandler(req,h) {
        try {
            const { id:credentialId } = req.auth.credentials;
            const { playlistId } = req.params;
      
            // await this._playlistService.verifyPlaylistAccess(playlistId, userId);
            const data = await this._service.getSongInPlaylist(playlistId);
      
            return {
              status: 'success',
              data: {
                // songs,
                songs:data.map((n)=>({
                  id:n.id,
                  title:n.title,
                  performer:n.performer
                }))
              },
            };
        } catch (error) {
            if (error instanceof ClientError) {
              const res = h.response({
                status: 'fail',
                message: error.message,
              });
              return res.code(error.statusCode);
            }
      
            const res = h.response({
              status: 'error',
              message: 'Terjadi server error',
            });
            console.warn(error);
            return res.code(500);
        }
    }

    async deleteSongPlaylistByIdHandler(req, h) {
        try {
            this._validator.validatePlaylistSongPayload(req.payload);
            const { songId } = req.payload;
            const { id:credentialId } = req.auth.credentials;
            const { playlistId } = req.params;
      
            // await this._playlistService.verifyPlaylistAccess(playlistId, userId);
            // await this._songService.verifySongService(songId);
            await this._service.deleteSongInPlaylist(playlistId, songId);
      
            return {
              status: 'success',
              message: 'Lagu berhasil dihapus dari playlist',
            };
          } catch (error) {
            if (error instanceof ClientError) {
              const res = h.response({
                status: 'fail',
                message: error.message,
              });
              return res.code(error.statusCode);
            }
      
            const res = h.response({
              status: 'error',
              message: 'Terjadi server error',
            });
            console.warn(error);
            return res.code(500);
          }
    }
    
}

module.exports=PlaylistHandler;