class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
        this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
    }

    async postCollaborationsHandler(request, h) {
        this._validator.validateCollaborationsValidator(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const collaborations = await this._collaborationsService.addCollaborations(playlistId, userId);

        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborations,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationsHandler(request) {
        this._validator.validateCollaborationsValidator(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaborations(playlistId, userId);

        return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        };
    }
}

module.exports = CollaborationsHandler;