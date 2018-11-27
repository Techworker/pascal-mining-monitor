/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const TCPProxy = require('tcp-proxy.js');
const events = require('./../Events');
module.exports = (function() {

    /**
     * A class to monitor the proxy.
     */
    class ProxyMonitor
    {
        /**
         * Prefix for monitor events.
         *
         * @param {String} append
         * @returns {String}
         */
        static EV_PREFIX(append) {
            if(append !== undefined && append !== '') {
                return `proxy.${append}`;
            }

            return 'proxy';
        }

        /**
         * Refresh event.
         *
         * @returns {string}
         */
        static EV_CONNECTED() {
            return ProxyMonitor.EV_PREFIX('connected');
        }

        /**
         * Refresh event.
         *
         * @returns {string}
         */
        static EV_DISCONNECTED() {
            return ProxyMonitor.EV_PREFIX('disconnected');
        }

        /**
         * Constructor
         *
         * @param {ProxyConfig} config
         */
        constructor(config)
        {
            const proxy = new TCPProxy({
                port: config.proxyPort,
                host: config.proxyIp
            });

            proxy.createProxy({
                forwardPort: config.walletPort,
                forwardHost: config.walletIp,
            }).then((server) => {
                server.on('connection', (client, server) => {
                    console.log('Connected', client.remoteAddress);
                    events.emit(ProxyMonitor.EV_CONNECTED(), {
                        ip: client.remoteAddress,
                        config: config
                    });
                    client.on('close', function() {
                        events.emit(ProxyMonitor.EV_DISCONNECTED(), this);
                    }.bind(client.remoteAddress))
                });
            });
        }
    }

    return ProxyMonitor;
})();