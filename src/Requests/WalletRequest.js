/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const request = require('request');

module.exports = (function() {

    const CONFIG = Symbol('config');

    // rpc id
    let id = 1;

    /**
     * A helper method to query the wallet via JSON-RPC.
     *
     * @param {String} url
     * @param {String} method
     * @param {Object|undefined} params
     * @returns {Promise<any>}
     */
    function rpcRequest(url, method, params)
    {
        // build basic params
        let json = {
            id: id++,
            jsonrpc: '2.0',
            method,
        };

        // append params if given
        if(params !== undefined) {
            json.params = params;
        }

        // do the request
        return new Promise((resolve, reject) => {
            request.post(url, {json}, (error, response, body) => {
                // HTTP ERROR
                if (error) {
                    reject(error);
                    return;
                }

                // RPC ERROR
                if (body.error) {
                    reject(body.error.message);
                    return;
                }

                // success.
                if (response.statusCode === 200) {
                    resolve(body.result);
                }
            });
        });
    }

    /**
     * A class to make requests to the wallet via JSON-API.
     */
    class WalletRequest
    {
        /**
         * Constructor.
         *
         * @param {WalletConfig} config
         */
        constructor(config)
        {
            this[CONFIG] = config;
        }

        /**
         * Requests the block count.
         *
         * @returns {Promise<any>}
         */
        blockCount() {
            return rpcRequest(this[CONFIG].rpcAddress, 'getblockcount');
        }

        /**
         * Requests the number of accounts for either the configured public key
         * or all known keys.
         *
         * @returns {Promise<any>}
         */
        accounts()
        {
            if(this[CONFIG].b58PubKey !== '') {
                return rpcRequest(this[CONFIG].rpcAddress, 'getwalletaccountscount', {
                    b58_pubkey: this[CONFIG].b58PubKey
                });
            }

            return rpcRequest(this[CONFIG].rpcAddress, 'getwalletaccountscount');
        }

        /**
         * Requests the balance of the wallet for either the given public key or
         * all available keys.
         *
         * @returns {Promise<any>}
         */
        balance()
        {
            if(this[CONFIG].b58PubKey !== '') {
                return rpcRequest(this[CONFIG].rpcAddress, 'getwalletcoins', {
                    b58_pubkey: this[CONFIG].b58PubKey
                });
            }

            return rpcRequest(this[CONFIG].rpcAddress, 'getwalletcoins');
        }

        /**
         * Gets the last mined block.
         *
         * @returns {Promise<any>}
         */
        latestBlock()
        {
            return rpcRequest(this[CONFIG].rpcAddress, 'getblocks', {
                last: 1
            });
        }
    }

    return WalletRequest;
})();