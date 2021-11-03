const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSongPayloadSchema } = require("./schema")

const PlaylistSongValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);
        //jika error
        if(validationResult.error) {
            // throw new Error(validationResult.error.message);
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = PlaylistSongValidator;