/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

// content of index.js
const log = require('./Logger');
const WalletMonitor = require('./Monitor/WalletMonitor');
const ServerMonitor = require('./Monitor/ServerMonitor');
const events = require('./Events');
const WS = require('ws');

module.exports = (function() {

    class WebSocket
    {
        /**
         *
         * @param {WebSocketConfig} config
         */
        constructor(config)
        {
            this.walletState = {};
            this.serverStates = [];

            log.info('WebSocket started on port ' + config.port);
            this.wss = new WS.Server({ port: config.port });
            this.wss.on('connection', (ws) => {
                ws.isAlive = true;
                ws.on('pong', function() {
                    this.isAlive = true;
                });
                this.broadcast({
                    event: 'wallet.init', data: this.walletState
                });
                this.broadcast({
                    event: 'servers.init', data: this.serverStates.map(s => s.serialize())
                });

            });

            setInterval(() => {
                this.wss.clients.forEach((ws) => {
                    if (ws.isAlive === false) return ws.terminate();
                    ws.isAlive = false;
                    ws.ping(() => {});
                });
            }, config.ping * 1000);

            events.on(WalletMonitor.EV_REFRESH(), (event, state) => {
                this.walletState = state.serialize();
                this.broadcast({
                    event, data: this.walletState
                });
            });
            events.on(ServerMonitor.EV_REFRESH(), (event, state) =>
            {
                const idx = this.serverStates.findIndex((serverStateItem) => {
                    return serverStateItem.config.ip === state.config.ip;
                });

                if(idx === -1) {
                    this.serverStates.push(state);
                } else {
                    this.serverStates[idx] = state;
                }

                this.broadcast({
                    event: 'servers.refresh', data: state.serialize()
                });
            });
        }

        broadcast(data)
        {
            this.wss.clients.forEach(function each(client) {
                if (client.readyState === WS.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    }

    return WebSocket;
})();