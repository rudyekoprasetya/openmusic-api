const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    //post playlist
    async addPlaylist(playlistName, userId) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistName, userId],
        };

        const result = await this._pool.query(query);
 
        if (!result.rows.length) {
        throw new InvariantError('Playlists gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    //get playlist
    async getPlaylist(owner) {
        const query = {
            text: `SELECT a.id, a.name, b.username FROM playlists a JOIN users b ON a.owner=b.id WHERE a.owner=$1 OR b.id=$1`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows;
    }

    //del playlist
    async deletePlaylist(playlistId, userId) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
            values: [playlistId, userId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal dihapus');
        }
    }

    //post song to playlist
    async addSongToPlaylist(playlistId,songId) {
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3)',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
 
        if (!result.rows.length) {
        throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
        return result.rows[0].id;
    }

    //get song in playlist 
    async getSongInPlaylist(playlistId) {
        const query = {
            text: 'SELECT a.id a.title, a.performer FROM songs a JOIN playlistsongs b ON a.id = b.song_id JOIN playlist c ON c.id = b.playlist_id WHERE b.playlist_id = $1 OR c.id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    //del songs from playlist 
    async deleteSongInPlaylist(playlistId,songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
            throw new InvariantError('Lagu di playslist gagal dihapus');
        }
    }

    //verifikasi Playlist owner
    async verifyPlaylistOwner(playlistId, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id=$1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if(playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
    
}

module.exports = PlaylistsService;