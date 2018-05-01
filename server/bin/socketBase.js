/**
 * WebSocket router
 */
var express = require('express');
var expressWS = require('express-ws');
var wsRouter = null;

class WSRouter {

    constructor(server) {
        this.server = server;
        this.app = express();
        this.wsInstance = expressWS(this.app, this.server);
        this.msgItems = [];
        this.clients = [];
    }

   lintenClientConnect() {
        this.app.ws('/ws', (ws, req) => {
            console.log('One client connect to WSServer successful');
            this.clients = this.wsInstance.getWss('/ws').clients;

            if (this.msgItems.length > 0) ws.send(JSON.stringify(this.msgItems));

            ws.on('message', (msg) => {
                console.log('WSServer receive client msg :', msg);

                this.msgItems.push(JSON.parse(msg));
                this.clients.forEach((client) => {
                    client.send(JSON.stringify(this.msgItems));
                });
            });

            ws.on('close', () => {
                console.log("One client is closed");

                this.clients = this.wsInstance.getWss('/ws').clients;
            });
        });
    }

}

function init(server){
    if(wsRouter === null && server !== null){
        wsRouter = new WSRouter(server);
    }
    return wsRouter;
}

module.exports = init;