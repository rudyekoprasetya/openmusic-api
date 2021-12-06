class deletePlaylistsongsBySongidHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.deletePlaylistsongsBySongidHandlerAsync = this.deletePlaylistsongsBySongidHandlerAsync.bind(this);
    }
    async deletePlaylistsongsBySongidHandlerAsync(request) {
        const { playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deletePlaylistsongsBySongid(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
}
module.exports = deletePlaylistsongsBySongidHandler;