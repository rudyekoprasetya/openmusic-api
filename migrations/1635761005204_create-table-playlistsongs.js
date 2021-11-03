/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlistsongs',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    //tambah constraint untuk relasi ke table songs dan playlist
    pgm.addConstraint('playlistsongs','fk_playlist.playlist_id','FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

    pgm.addConstraint('playlistsongs','fk_playlist.song_id','FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE');
}

exports.down = pgm => {
    pgm.dropTable('playlistsongs');
};
