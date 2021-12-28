class CollaborationsHandler {
    constructor(collaborationsService, playlistService, validator) {
      this._collaborationsService = collaborationsService;
      this._playlistService = playlistService;
      this._validator = validator;
  
      this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
      this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }
  
    async postCollaborationHandler(request, h) {
      this._validator.validateCollaborationPayload(request.payload);
  
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
  
      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
  
      const collaborationId = await this._collaborationsService.addCollaboration({
        playlistId,
        userId,
      });
  
      const response = h.response({
        status: 'success',
        message: 'collaboration berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    }
  
    async deleteCollaborationHandler(request, h) {
      this._validator.validateCollaborationPayload(request.payload);
  
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;
  
      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration({ playlistId, userId });
  
      const response = h.response({
        status: 'success',
        message: 'Collaboration berhasil dihapus',
      });
      response.code(200);
      return response;
    }
  }
  
  module.exports = CollaborationsHandler;
  