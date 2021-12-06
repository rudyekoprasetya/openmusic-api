const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToPlaylists, mapDBToModel } = require("../../utils");

class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
    }

    //Playlists
    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
            JOIN users ON playlists.owner = users.id 
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapDBToPlaylists);
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan.')
        }
    }

    //Playlistsongs
    async addPlaylistsongs(playlistId, songId) {
        const id = `playlistsong-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1,$2,$3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }

        return result.rows[0].id;
    }

    async getPlaylistsongs(playlistId) {
        const query = {
            text: 'SELECT songs.id as id, songs.title as title, songs.performer as performer FROM songs LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id WHERE playlist_id = $1 GROUP BY songs.id',
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        return result.rows.map(mapDBToModel);
    }

    async deletePlaylistsongsBySongid(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus dari playlist. Id lagu tidak ditemukan');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if(!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];
        if(playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, owner) {
        try {
            await this.verifyPlaylistOwner(playlistId, owner);
        } catch (error) {
            if(error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationsService.verifyCollaborations(playlistId, owner);
            } catch {
                throw error;
            }
        }
    }

}

module.exports = PlaylistsService;