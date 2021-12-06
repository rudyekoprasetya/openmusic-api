const { nanoid } = require('nanoid');
const {Pool} = require('pg');
//import mapping db
const {mapDBToModel} = require('../../utils')
//import error
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    //untuk tambah data dalam database
    async addSong({title, year, performer, genre, duration}) {
        //membuat ID dan tanggal otomatis
        const id = "song-"+nanoid(16);
        const insertedAt = new Date().toISOString;
        const updatedAt = insertedAt;

        //query insert
        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
        }

        //eksekusi query
        const res = await this._pool.query(query);

        //validasi
        if(!res.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        //kembalikan nilai
        return res.rows[0].id;
    }

    //tampil data
    async getSongs() {
        const query = 'SELECT * FROM songs';
        const res = await this._pool.query(query);
        //kembalikan dengan Mapping
        return res.rows.map(mapDBToModel);
    }

    //cari data
    async getSongById(id) {
        const query={
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }

        const res = await this._pool.query(query);

        //jika tidak ketemu atau hasilnya 0
        if(!res.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        //kembalikan hasil
        return res.rows.map(mapDBToModel)[0];
    }

    // ubah data 
    async editSongById(id, {title, year, performer, genre, duration}) {
        const updatedAt = new Date().toISOString;
        const query = {
            text: 'UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, updated_at=$6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id]
        }

        const res = await this._pool.query(query);

        //cek 
        if (!res.rows.length) {
            throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
        }
    }

    //hapus data
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        }

        const res = await this._pool.query(query);

        //cek
        if (!res.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = SongsService;