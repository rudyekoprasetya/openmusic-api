const ClientError = require('../../exceptions/ClientError');

class putSongByIdHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.putSongByIdHandlerAsync = this.putSongByIdHandlerAsync.bind(this);
    }

    

    async putSongByIdHandlerAsync(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;

            await this._service.editSongById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbaharui',
            }
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
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    
}

module.exports = putSongByIdHandler;