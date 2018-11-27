/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const net = require('net');
const ServerState = require('../State/ServerState');

module.exports = (function() {

    const SOCKETS = Symbol('sockets');

    /**
     * Request class that can fetch data from an rhminer.
     */
    class RHMiner
    {
        /**
         * Constructor
         */
        constructor()
        {
            this[SOCKETS] = {};
        }

        /**
         * Tries to destroy a socket connection.
         *
         * @param {Server} server
         */
        tryDestroySocket(server)
        {
            if(!(server.ip in this[SOCKETS])) {
                return;
            }

            try {
                this[SOCKETS][server.ip].destroy();
                delete this[SOCKETS][server.ip];
            } catch (e) {
                // TODO: what to do now..
            }
        }

        /**
         * Requests the given server.
         *
         * @param {Object} server
         * @returns {Promise<any>}
         */
        request(server)
        {
            return new Promise((resolve, reject) =>
            {
                // if the socket is alive, try to close it…
                if(this[SOCKETS][server.ip] !== undefined) {
                    this.tryDestroySocket(server);
                }

                // create new socket
                this[SOCKETS][server.ip] = new net.Socket();

                // try to make sure the socket gets closed by all means
                setTimeout(() => {
                    this.tryDestroySocket(server);
                    reject({
                        server: server,
                        state: ServerState.STATE_ERROR(),
                        msg: 'Socket problem.'
                    });
                }, server.timeout * 100000 * 2);

                // set socket timeout
                this[SOCKETS][server.ip].setTimeout(server.timeout * 1000);
                this[SOCKETS][server.ip].connect(server.port, server.ip, function() {
                    this[SOCKETS][server.ip].write(' ');
                }.bind(this));

                // check if the socket responded
                this[SOCKETS][server.ip].on('data', (data) => {
                    this.tryDestroySocket(server);

                    console.log(server);
                    // empty response
                    if(data.toString().trim() === "{}") {
                        reject({
                            server: server,
                            state: ServerState.STATE_BOOTING(),
                            msg: 'Empty response, miner is probably booting, stay tuned...'
                        });
                    } else {
                        resolve({
                            server: server,
                            data: JSON.parse(data.toString().trim())
                        });
                    }
                });

                // check errors
                this[SOCKETS][server.ip].on('error', (e) => {
                    reject({
                        server: server,
                        state: ServerState.STATE_ERROR(),
                        msg: e.toString()
                    });
                    this.tryDestroySocket(server);
                });

                // timeout..
                this[SOCKETS][server.ip].on('timeout', () => {
                    reject({
                        server: server,
                        state: ServerState.STATE_ERROR(),
                        msg: `Server not reachable, timeout after ${server.timeout}s`
                    });
                    this.tryDestroySocket(server);
                });
            });
        }
    }

    return RHMiner;
})();