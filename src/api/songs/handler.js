const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
    constructor(service, validator) {
        this._service=service;
        this._validator=validator;

        // mengikat this agar nilainya tetap mengacu ke class 
        this.postSongHandler=this.postSongHandler.bind(this)
        this.getSongsHandler=this.getSongsHandler.bind(this)
        this.getSongByIdHandler=this.getSongByIdHandler.bind(this)
        this.putSongHandler=this.putSongHandler.bind(this)
        this.deleteSongByIdHandler=this.deleteSongByIdHandler.bind(this)

    }

    async postSongHandler(req,h){
        try {
            // memasukan validator di handler post 
            this._validator.validateSongPayload(req.payload);
            const {title = 'untitled', year, performer, genre,duration} =req.payload;
            const songId = await this._service.addSong({title, year, performer, genre, duration});
            const res = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                }
            });
            res.code(201);
            return res;
        } catch (error) {
            if(error instanceof ClientError) {
                const res = h.response({
                    status: 'fail',
                    message: error.message
                });
                res.code(error.statusCode);
                return res;
            }

            //server Error
            const res = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            res.code(500);
            console.log(error);
            return res;
        }
    }

    async getSongsHandler() {
        const data = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs:data.map((n)=>({
					id:n.id,
					title:n.title,
					performer:n.performer
				}))
            }
        }
    }

    async getSongByIdHandler(req,h) {
        try { 
            const { id } = req.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song
                }
            }
        } catch(error) {
            if(error instanceof ClientError) {
                const res = h.response({
                    status: 'fail',
                    message: error.message
                });
                res.code(error.statusCode);
                return res;
            }

            //server Error
            const res = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            res.code(500);
            console.log(error);
            return res;
        }  
    }

    async putSongHandler(req,h){
        try{
            //membuat validator untuk update data
            this._validator.validateSongPayload(req.payload);
            const { id } = req.params;

            //update
            await this._service.editSongById(id, req.payload);

            return {
                status : 'success',
                message : 'Lagu berhasil diubah'
            }
        } catch(error) {
            if(error instanceof ClientError) {
                const res = h.response({
                    status: 'fail',
                    message: error.message
                });
                res.code(error.statusCode);
                return res;
            }
            

            //server Error
            const res = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            res.code(500);
            console.log(error);
            return res;
        }
        
    }

    async deleteSongByIdHandler(req,h){
        try{
            const {id} = req.params;
            await this._service.deleteSongById(id);
            const res=h.response({
                status: 'success',
                message: 'Lagu berhasil dihapus'
            });
            res.code(200);
            return res;
        } catch(error) {
            if(error instanceof ClientError) {
                const res = h.response({
                    status: 'fail',
                    message: error.message
                });
                res.code(error.statusCode);
                return res;
            }

            //server Error
            const res = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            });
            res.code(500);
            console.log(error);
            return res;
        }
    }
}

module.exports = SongsHandler;