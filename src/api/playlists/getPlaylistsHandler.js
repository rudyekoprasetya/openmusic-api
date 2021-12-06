class getPlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.getPlaylistsHandlerAsync = this.getPlaylistsHandlerAsync.bind(this);
    }
    async getPlaylistsHandlerAsync(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }
}

module.exports = getPlaylistsHandler;