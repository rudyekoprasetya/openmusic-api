const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistPayloadSchema } = require("./schema")

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        //jika error
        if(validationResult.error) {
            // throw new Error(validationResult.error.message);
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = PlaylistsValidator;