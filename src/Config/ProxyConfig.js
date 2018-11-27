/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const Utility = require('./../Utility');

module.exports = (function() {

    const PROXY_IP = Symbol('proxy_ip');
    const PROXY_PORT = Symbol('proxy_port');
    const WALLET_IP = Symbol('wallet_ip');
    const WALLET_PORT =Symbol('wallet_port');

    const PORT = Symbol('port');
    const TIMEOUT = Symbol('timeout');
    const INTERVAL = Symbol('interval');
    const MARK_DOWN_AFTER = Symbol('mark_down_after');
    const RETRY_AFTER_DOWN = Symbol('retry_after_down');

    /**
     * Holds the configuration of a server.
     */
    class ProxyConfig
    {
        /**
         * Contructor
         *
         * @param {String} proxyIp
         * @param {Number} proxyPort
         * @param {String} walletIp
         * @param {Number} walletPort
         * @param {Number} port
         * @param {Number} timeout
         * @param {Number} interval
         * @param {Number} markDownAfter
         * @param {Number} retryAfterDown
         */
        constructor(proxyIp, proxyPort, walletIp, walletPort, port, timeout, interval, markDownAfter, retryAfterDown)
        {
            this[PROXY_IP] = proxyIp;
            this[PROXY_PORT] = parseInt(proxyPort, 10);
            this[WALLET_IP] = walletIp;
            this[WALLET_PORT] = parseInt(walletPort, 10);
            this[PORT] = parseInt(port, 10);
            this[TIMEOUT] = parseInt(timeout, 10);
            this[INTERVAL] = parseInt(interval, 10);
            this[MARK_DOWN_AFTER] = parseInt(markDownAfter, 10);
            this[RETRY_AFTER_DOWN] = parseInt(retryAfterDown, 10);
        }

        /**
         * Gets the IP Address of the server.
         *
         * @returns {String}
         */
        get proxyIp() {
            return this[PROXY_IP];
        }

        /**
         * Gets the port of the server.
         *
         * @returns {Number}
         */
        get proxyPort() {
            return this[PROXY_PORT];
        }

        /**
         * Gets the IP Address of the server.
         *
         * @returns {String}
         */
        get walletIp() {
            return this[WALLET_IP];
        }

        /**
         * Gets the port of the server.
         *
         * @returns {Number}
         */
        get walletPort() {
            return this[WALLET_PORT];
        }

        /**
         * Gets the port of the server.
         *
         * @returns {Number}
         */
        get port() {
            return this[PORT];
        }

        /**
         * Gets the timeout for requests to the server in seconds.
         *
         * @returns {Number}
         */
        get timeout() {
            return this[TIMEOUT];
        }

        /**
         * Gets the interval in seconds the server should be requested.
         *
         * @returns {Number}
         */
        get interval() {
            return this[INTERVAL];
        }

        /**
         * Gets the number of tries until the server is marked as down.
         *
         * @returns {Number}
         */
        get markDownAfter() {
            return this[MARK_DOWN_AFTER];
        }

        /**
         * Gets the number of seconds until a server gets rerequested after it
         * was marked as "down".
         *
         * @returns {Number}
         */
        get retryAfterDown() {
            return this[RETRY_AFTER_DOWN];
        }

        serialize() {
            return Utility.serialize(this, PROXY_IP, PROXY_PORT, WALLET_IP,
                WALLET_PORT, PORT, TIMEOUT, INTERVAL, DISCOVERY,
                MARK_DOWN_AFTER, RETRY_AFTER_DOWN
            );
        }
    }

    return ProxyConfig;
})();