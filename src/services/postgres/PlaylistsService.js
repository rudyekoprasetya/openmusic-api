const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
    constructor(collaborationService,cacheService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService;
        this._cacheService = cacheService;
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
        //cache
        await this._cacheService.delete(`playlists:${userId}`);
        return result.rows[0].id;
    }

    //get playlist
    async getPlaylist(owner) {
        try {
            const result = await this._cacheService.get(`playlists:${owner}`);
      return JSON.parse(result);
        } catch(error) {
            const query = {
                text: `SELECT a.id, a.name, b.username FROM playlists a INNER JOIN users b ON a.owner=b.id WHERE a.owner=$1 OR b.id=$1`,
                values: [owner],
            };

            const result = await this._pool.query(query);
            await this._cacheService.set(`playlists:${owner}`, JSON.stringify(result.rows));
            if (!result.rows.length) {
                throw new NotFoundError('Playlist tidak ditemukan');
            }

            return result.rows;
        }
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
        const { owner } = result.rows[0];
        await this._cacheService.delete(`playlists:${owner}`);
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

    async verifyPlaylistAccess(playlistId, userId) {
        try {
          await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error;
          }
          try {
            await this._collaborationService.verifyCollaborator(playlistId, userId);
          } catch {
            throw error;
          }
        }
    }
    
}

module.exports = PlaylistsService;