const ClientError = require('../../exceptions/ClientError');

class getSongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.getSongsHandlerAsync = this.getSongsHandlerAsync.bind(this);
    }
    async getSongsHandlerAsync() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs: songs.map((song) => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
        };
    }
}

module.exports = getSongsHandler;