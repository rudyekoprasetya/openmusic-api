class postPlaylistsongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postPlaylistsongsHandlerAsync = this.postPlaylistsongsHandlerAsync.bind(this);
    }
    async postPlaylistsongsHandlerAsync(request, h) {
        this._validator.validatePlaylistsongsValidator(request.payload);
        const { songId } = request.payload;
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addPlaylistsongs(playlistId, songId);
        
        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke dalam playlist',
        });
        response.code(201);
        return response;
    }
}
module.exports = postPlaylistsongsHandler;