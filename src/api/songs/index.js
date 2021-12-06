const SongsHandler = require('./handler');
const routes = require('./router');

module.exports = {
    name: 'songs',
    version: '1.0.0',
    register: async(server, {service, validator}) => {
        //instance handler
        const songsHandler = new SongsHandler(service, validator);
        //atur route
        server.route(routes(songsHandler))
    }
}