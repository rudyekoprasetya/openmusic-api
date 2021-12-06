class getPlaylistsongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.getPlaylistsongsHandlerAsync = this.getPlaylistsongsHandlerAsync.bind(this);
    }
    async getPlaylistsongsHandlerAsync(request) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        const songs = await this._service.getPlaylistsongs(playlistId);
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }
}
module.exports = getPlaylistsongsHandler;