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
const express = require('express');
const log = require('./Logger');
const WalletMonitor = require('./Monitor/WalletMonitor');
const ServerMonitor = require('./Monitor/ServerMonitor');
const events = require('./Events');


module.exports = (function() {

    class WebServer
    {
        /**
         *
         * @param {WebServerConfig} config
         */
        constructor(config)
        {
            this.state = {
                wallet: null,
                servers: []
            };

            events.on(WalletMonitor.EV_REFRESH(), (event, walletState) => {
                this.state.wallet = walletState;
            });

            events.on(ServerMonitor.EV_REFRESH(), (event, serverState) => {
                const idx = this.state.servers.findIndex((serverStateItem) => {
                    return serverStateItem.config.ip === serverState.config.ip;
                });
                if(idx === -1) {
                    this.state.servers.push(serverState);
                } else {
                    this.state.servers[idx] = serverState;
                }
            });

            this.app = express();
            this.app.get('/', (req, res) => {
                res.json({
                    wallet: this.state.wallet.serialize(),
                    servers: this.state.servers.map(s => s.serialize())
                });
            });
            this.app.get('/wallet', (req, res) => {
                res.json(this.state.wallet.serialize());
            });
            this.app.get('/servers', (req, res) => {
                res.json(this.state.servers.map(s => s.serialize()));
            });

            this.app.listen(config.port, config.ip, () => {
                log.info(`WebServer started: ${config.ip}:${config.port}`);
            });
        }
    }

    return WebServer;
})();