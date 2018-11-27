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
    const IP = Symbol('ip');
    const PORT = Symbol('port');

    /**
     * Configuration for the webserver.
     */
    class WebServerConfig
    {
        /**
         * Constructor
         *
         * @param {String} ip
         * @param {Number} port
         */
        constructor(ip, port) {
            this[IP] = ip.trim();
            this[PORT] = parseInt(port, 10);
        }

        /**
         * Gets the bind address of the webserver.
         *
         * @returns {String}
         */
        get ip() {
            return this[IP];
        }

        /**
         * Gets the port of the webserver.
         *
         * @returns {Number}
         */
        get port() {
            return this[PORT];
        }
    }

    return WebServerConfig;
})();