const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationsPayloadSchema } = require("./schema");

const CollaborationsValidator ={
    validateCollaborationsValidator: (payload) => {
        const validationsResult = CollaborationsPayloadSchema.validate(payload);
        if(validationsResult.error) {
            throw new InvariantError(validationsResult.error.message);
        }
    }
}

module.exports = CollaborationsValidator;