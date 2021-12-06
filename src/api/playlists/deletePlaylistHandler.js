class deletePlaylistHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.deletePlaylistHandlerAsync = this.deletePlaylistHandlerAsync.bind(this);
    }
    async deletePlaylistHandlerAsync(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }
}
module.exports = deletePlaylistHandler;