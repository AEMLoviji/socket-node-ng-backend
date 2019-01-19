const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};

export class SocketServer {
    constructor(config) {
        this.config = config;
    }

    build() {

        io.configure(function () {
            io.set("transports", ["xhr-polling"]);
            io.set("polling duration", 10);
        });

        io.on('connection', function (socket) {
            let previousId;
            const safeJoin = function (currentId) {
                socket.leave(previousId);
                socket.join(currentId);
                previousId = currentId;
            };

            socket.on("getDoc", function (docId) {
                safeJoin(docId);
                socket.emit("document", documents[docId]);
            });

            socket.on("addDoc", function (doc) {
                documents[doc.id] = doc;
                safeJoin(doc.id);
                io.emit("documents", Object.keys(documents));
                socket.emit("document", doc);
            });

            socket.on("editDoc", function (doc) {
                documents[doc.id] = doc;
                socket.to(doc.id).emit("document", doc);
            });

            socket.on("removeDoc", function (docId) {
                delete documents[docId];

                safeJoin(docId);
                io.emit("documents", Object.keys(documents));
            });

            io.emit("documents", Object.keys(documents));
        });

        return this;
    }

    start() {
        http.listen(this.config.getPort(),
            () => console.log(`Listening on port ${this.config.getPort()}`)
        );
    }
}