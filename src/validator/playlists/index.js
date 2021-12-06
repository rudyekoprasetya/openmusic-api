const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, PlaylistsongsPayloadSchema } = require('./schema'); 

const PlaylistValidator = {
    validatePlaylistValidator: (payload) => {
        const validationsResult = PlaylistPayloadSchema.validate(payload);
        if(validationsResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePlaylistsongsValidator: (payload) => {
        const validationResult = PlaylistsongsPayloadSchema.validate(payload);
        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistValidator;