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
    const PATTERN = Symbol('pattern');
    const TIMEOUT = Symbol('timeout');
    const INTERVAL = Symbol('interval');
    const PORT = Symbol('port');
    const MARK_DOWN_AFTER = Symbol('mark_down_after');
    const RETRY_AFTER_DOWN = Symbol('retry_after_down');

    /**
     * Holds the information about the discovery.
     */
    class DiscoveryConfig
    {
        /**
         * Constructor
         *
         * @param {String} pattern
         * @param {Number} port
         * @param {Number} timeout
         * @param {Number} interval
         * @param {Number} markDownAfter
         * @param {Number} retryAfterDown
         */
        constructor(pattern, port, timeout, interval, markDownAfter, retryAfterDown)
        {
            this[PATTERN] = pattern.trim();
            this[PORT] = parseInt(port, 10);
            this[TIMEOUT] = parseInt(timeout, 10);
            this[INTERVAL] = parseInt(interval, 10);
            this[MARK_DOWN_AFTER] = parseInt(markDownAfter, 10);
            this[RETRY_AFTER_DOWN] = parseInt(retryAfterDown, 10);
        }

        /**
         * Gets the discovery pattern.
         *
         * @returns {String}
         */
        get pattern() {
            return this[PATTERN];
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
    }

    return DiscoveryConfig;
})();

