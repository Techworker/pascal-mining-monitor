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

    const IP = Symbol('ip');
    const PORT = Symbol('port');
    const TIMEOUT = Symbol('timeout');
    const INTERVAL = Symbol('interval');
    const DISCOVERY = Symbol('discovery');
    const MARK_DOWN_AFTER = Symbol('mark_down_after');
    const RETRY_AFTER_DOWN = Symbol('retry_after_down');

    /**
     * Holds the configuration of a server.
     */
    class ServerConfig
    {
        /**
         * Contructor
         *
         * @param {String} ip
         * @param {Number} port
         * @param {Number} timeout
         * @param {Number} interval
         * @param {Number} markDownAfter
         * @param {Number} retryAfterDown
         */
        constructor(ip, port, timeout, interval, markDownAfter, retryAfterDown)
        {
            this[IP] = ip.toString();
            this[PORT] = parseInt(port, 10);
            this[TIMEOUT] = parseInt(timeout, 10);
            this[INTERVAL] = parseInt(interval, 10);
            this[MARK_DOWN_AFTER] = parseInt(markDownAfter, 10);
            this[RETRY_AFTER_DOWN] = parseInt(retryAfterDown, 10);
            this[DISCOVERY] = null;
        }

        /**
         * Gets the IP Address of the server.
         *
         * @returns {String}
         */
        get ip() {
            return this[IP];
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

        /**
         * Gets the pattern the was generated from.
         *
         * @returns {DiscoveryConfig}
         */
        get discovery() {
            return this[DISCOVERY];
        }

        serialize() {
            return Utility.serialize(this, IP, PORT, TIMEOUT, INTERVAL,
                DISCOVERY, MARK_DOWN_AFTER, RETRY_AFTER_DOWN);
        }
    }

    return ServerConfig;
})();