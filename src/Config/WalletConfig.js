/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const Utility = require('../Utility');

module.exports = (function()
{
    const IP = Symbol('ip');
    const PORT = Symbol('port');
    const INTERVAL = Symbol('interval');
    const B58PUBKEY = Symbol('b58_pubkey');

    /**
     * Holds the wallet configuration to fetch blocks, balances etc.
     */
    class WalletConfig
    {
        /**
         * Constructor.
         *
         * @param {String} ip
         * @param {Number} port
         * @param {Number} interval
         * @param {String} b58PubKey
         */
        constructor(ip, port, interval, b58PubKey) {
            this[IP] = ip.trim();
            this[PORT] = parseInt(port, 10);
            this[INTERVAL] = parseInt(interval, 10);
            this[B58PUBKEY] = b58PubKey;
        }

        /**
         * Gets the IP of the running wallet.
         *
         * @returns {String}
         */
        get ip() {
            return this[IP];
        }

        /**
         * Gets the port of the wallet.
         *
         * @returns {Number}
         */
        get port() {
            return this[PORT];
        }

        /**
         * Gets the interval in seconds the wallet should be queried.
         *
         * @returns {Number}
         */
        get interval() {
            return this[INTERVAL];
        }

        /**
         * Gets the public key that should be used to fetch data.
         *
         * @returns {String}
         */
        get b58PubKey() {
            return this[B58PUBKEY];
        }

        /**
         * Gets the RPC address of the wallet.
         *
         * @returns {String}
         */
        get rpcAddress() {
            return `http://${this[IP]}:${this[PORT]}`;
        }

        /**
         * Gets the serialized object for this config.
         *
         * @returns {Object}
         */
        serialize() {
            return Utility.serialize(this, IP, PORT, INTERVAL, B58PUBKEY);
        }

        /**
         * Gets the default wallet iP.
         *
         * @returns {String}
         */
        static getDefaultIp() {
            return '127.0.0.1';
        }

        /**
         * Gets the default wallet port.
         *
         * @returns {Number}
         */
        static getDefaultPort() {
            return 4003;
        }
    }

    return WalletConfig;
})();