class postPlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandlerAsync = this.postPlaylistHandlerAsync.bind(this);
    }

    async postPlaylistHandlerAsync(request, h) {
        this._validator.validatePlaylistValidator(request.payload);
        const { name } = request.payload;

        const { id: credentialId } = request.auth.credentials;
        const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = postPlaylistHandler;