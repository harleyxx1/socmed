const http = require('http');
const io = require('socket.io');

class Socket { 
    constructor(app) {
        this.http = http.createServer(app);
        this.io = io(this.http);
    }

    getHttp() {
        return this.http;
    }
    
    connect() {
        this.io.on('connection', (socket) => {
            this.socket = socket;

            socket.emit('welcome', 'this is our server');
        });
    }
}

module.exports = Socket;