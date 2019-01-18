import net from 'net';

import '../src/server.js';

var client = new net.Socket();

describe('Socket Server', () => {
    it('Socket server is running', done => {
        client.connect(3500, 'localhost', function () {
            done();
        });
    });
});