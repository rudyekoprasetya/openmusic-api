const ClientError = require("../../exceptions/ClientError");

class PlaylistSongsHandler {
    constructor(service, servicePlaylist, validator) {
      this._service = service;
      this._servicePlaylist = servicePlaylist;
      this._validator = validator;
  
      this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
      this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
      this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    }
  
    async postPlaylistSongHandler(req, h) {
      try {
        this._validator.validatePlaylistSongPayload(req.payload);
    
        const { songId } = req.payload;
        const { playlistId } = req.params;
        const { id: credentialId } = req.auth.credentials;
    
        await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);
    
        const playlistsongsId = await this._service.addPlaylistSong({ songId, playlistId });
    
        const response = h.response({
          status: 'success',
          message: 'Lagu berhasil ditambahkan ke playlist',
          data: {
            playlistsongsId,
          },
        });
        response.code(201);
        return response;
      } catch(error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
   
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      } 
    }
  
    async getPlaylistSongHandler(req, h) {
      try {
        const { id: credentialId } = req.auth.credentials;
        const { playlistId } = req.params;
    
        await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);
    
        const songs = await this._service.getPlaylistSong(playlistId);
    
        const response = h.response({
          status: 'success',
          data: {
            songs,
          },
        });
        response.code(200);
        return response;
      } catch(error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
   
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      } 
    }
  
    async deletePlaylistSongHandler(req, h) {
      try {
        const { playlistId } = req.params;
        const { songId } = req.payload;
        const { id: credentialId } = req.auth.credentials;
    
        await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);
    
        const playlistsongsId = await this._service.deletePlaylistSongById(playlistId, songId);
    
        const response = h.response({
          status: 'success',
          message: 'Lagu berhasil dihapus dari playlist',
          data: {
            playlistsongsId,
          },
        });
        response.code(200);
        return response;
      } catch(error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
   
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      } 
  }
}
  
module.exports = PlaylistSongsHandler;
  