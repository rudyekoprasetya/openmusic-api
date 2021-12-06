const mapDBToModel = ({ inserted_at, updated_at, ...args }) => ({
  ...args,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToPlaylists = ({
  id,
  name,
  username,
}) => ({
  id, name, username,
});

module.exports = { mapDBToModel, mapDBToPlaylists };