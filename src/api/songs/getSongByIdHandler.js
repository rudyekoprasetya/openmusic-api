const ClientError = require('../../exceptions/ClientError');

class getSongByIdHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.getSongByIdHandlerAsync = this.getSongByIdHandlerAsync.bind(this);
    }

    async getSongByIdHandlerAsync(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
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

module.exports = getSongByIdHandler;