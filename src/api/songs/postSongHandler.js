const ClientError = require('../../exceptions/ClientError');

class postSongHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postSongHandlerAsync = this.postSongHandlerAsync.bind(this);
    }

    async postSongHandlerAsync(request, h) {
        try {
            this._validator.validateSongPayload(request.payload)
            const { title, year, performer, genre, duration } = request.payload;

            const songId = await this._service.addSong({ title, year, performer, genre, duration });
            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if(error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

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

module.exports = postSongHandler;