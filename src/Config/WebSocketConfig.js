/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

module.exports = (function()
{
    const PORT = Symbol('port');
    const PING = Symbol('ping');

    /**
     * Configuration for the webserver.
     */
    class WebSocketConfig
    {
        /**
         * Constructor
         *
         * @param {Number} port
         */
        constructor(port, ping) {
            this[PORT] = parseInt(port, 10);
            this[PING] = parseInt(ping, 10);
        }

        /**
         * Gets the port of the webserver.
         *
         * @returns {Number}
         */
        get port() {
            return this[PORT];
        }

        /**
         * Gets the interval in seconds to check for alive connections.
         *
         * @returns {Number}
         */
        get ping() {
            return this[PING];
        }
    }

    return WebSocketConfig;
})();