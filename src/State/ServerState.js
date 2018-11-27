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

module.exports = (function()
{
    const STATE = Symbol('state');
    const CONFIG = Symbol('config');
    const LAST_REFRESH = Symbol('last_refresh');
    const WALLET_CONNECTED = Symbol('wallet_connected');
    const WALLET_CONNECTED_TIME = Symbol('wallet_connected_time');
    const ERROR_MESSAGE = Symbol('error_message');
    const HASHRATE = Symbol('hashrate');
    const ACCEPTED = Symbol('accepted');
    const REJECTED = Symbol('rejected');
    const FAILED = Symbol('failed');
    const UPTIME = Symbol('uptime');
    const EXTRA_PAYLOAD = Symbol('extra_payload');
    const STRATUM_SERVER = Symbol('stratum.server');
    const STRATUM_USER = Symbol('stratum.user');
    const DIFF = Symbol('diff');

    /**
     * Holds the information about a servers state.
     */
    class ServerState
    {
        /**
         * Constructor.
         *
         * @param {ServerConfig} serverConfig
         */
        constructor(serverConfig)
        {
            this[STATE] = ServerState.STATE_INIT();
            this[CONFIG] = serverConfig;
            this[HASHRATE] = 0;
            this[LAST_REFRESH] = Math.floor(new Date().getTime() / 1000);
            this[ACCEPTED] = 0;
            this[REJECTED] = 0;
            this[WALLET_CONNECTED] = false;
            this[WALLET_CONNECTED_TIME] = 0;
            this[FAILED] = 0;
            this[UPTIME] = 0;
            this[EXTRA_PAYLOAD] = '';
            this[STRATUM_SERVER] = '';
            this[STRATUM_USER] = '';
            this[DIFF] = 0.0;
            this[DIFF] = 0.0;
        }

        /**
         * Gets the value to identify the idle status.
         *
         * @returns {String}
         */
        static STATE_SUCCESS() {
            return 'success';
        }

        /**
         * Gets the value to identify the error status.
         *
         * @returns {String}
         */
        static STATE_ERROR() {
            return 'error';
        }

        /**
         * Gets the value to identify the init status.
         *
         * @returns {String}
         */
        static STATE_INIT() {
            return 'init';
        }

        /**
         * Gets the value to identify the init status.
         *
         * @returns {String}
         */
        static STATE_MAYBE_DOWN() {
            return 'maybe_down';
        }

        /**
         * Gets the value to identify the init status.
         *
         * @returns {String}
         */
        static STATE_BOOTING() {
            return 'booting';
        }

        /**
         * Gets the configuration of the server.
         *
         * @returns {ServerConfig}
         */
        get config() {
            return this[CONFIG];
        }

        /**
         * Gets the current hashrate.
         *
         * @returns {Number}
         */
        get hashRate() {
            return this[HASHRATE];
        }

        /**
         * Sets the current hashrate.
         *
         * @param {Number} hashRate
         * @returns {ServerState}
         */
        set hashRate(hashRate) {
            this[HASHRATE] = hashRate;
            return this;
        }

        /**
         * Gets the number of accepted shares.
         *
         * @returns {Number}
         */
        get accepted() {
            return this[ACCEPTED];
        }

        /**
         * Sets the number of accepted shares.
         *
         * @param {Number} accepted
         * @returns {ServerState}
         */
        set accepted(accepted) {
            this[ACCEPTED] = accepted;
            return this;
        }

        /**
         * Gets the rejected shares,
         *
         * @returns {Number}
         */
        get rejected() {
            return this[REJECTED];
        }

        /**
         * Sets the rejected shares,
         *
         * @param {Number} rejected
         * @returns {Number}
         */
        set rejected(rejected) {
            this[REJECTED] = rejected;
            return this;
        }

        /**
         * Gets the failed shares.
         *
         * @returns {Number}
         */
        get failed() {
            return this[FAILED];
        }

        /**
         * Sets the failed shares.
         *
         * @param {Number} failed
         * @returns {ServerState}
         */
        set failed(failed) {
            this[FAILED] = failed;
            return this;
        }

        /**
         * Gets the uptime in seconds.
         *
         * @returns {Number}
         */
        get uptime() {
            return this[UPTIME];
        }

        /**
         * Sets the uptime in seconds.
         *
         * @param {Number} uptime
         * @returns {ServerState}
         */
        set uptime(uptime) {
            this[UPTIME] = uptime;
            return this;
        }

        /**
         * Gets the extra payload (rhminer)
         *
         * @returns {String}
         */
        get extraPayload() {
            return this[EXTRA_PAYLOAD];
        }

        /**
         * Sets the extra payload (rhminer)
         *
         * @param {String} extraPayload
         * @returns {ServerState}
         */
        set extraPayload(extraPayload) {
            this[EXTRA_PAYLOAD] = extraPayload;
            return this;
        }

        /**
         * Gets the stratum server.
         *
         * @returns {String}
         */
        get stratumServer() {
            return this[STRATUM_SERVER];
        }

        /**
         * Sets the stratum server.
         *
         * @param {String} stratumServer
         * @returns {ServerState}
         */
        set stratumServer(stratumServer) {
            this[STRATUM_SERVER] = stratumServer;
            return this;
        }

        /**
         * Gets the stratum user.
         *
         * @returns {String}
         */
        get stratumUser() {
            return this[STRATUM_USER];
        }

        /**
         * Sets the stratum user.
         *
         * @param {String} stratumUser
         * @returns {ServerState}
         */
        set stratumUser(stratumUser) {
            this[STRATUM_USER] = stratumUser;
            return this;
        }

        /**
         * Gets a flag indicating whether the miner is connected with the wallet.
         *
         * @returns {boolean}
         */
        get walletConnected() {
            return this[WALLET_CONNECTED];
        }

        /**
         * Gets a flag indicating whether the miner is connected with the wallet.
         *
         * @param {boolean} walletConnected
         * @returns {ServerState}
         */
        set walletConnected(walletConnected) {
            this[WALLET_CONNECTED] = walletConnected;
            return this;
        }

        /**
         * Gets the time the miner connected with the wallet.
         *
         * @returns {Number}
         */
        get walletConnectedTime() {
            return this[WALLET_CONNECTED_TIME];
        }

        /**
         * Gets the time the miner connected with the wallet.
         *
         * @param {Number} walletConnectedTime
         * @returns {ServerState}
         */
        set walletConnectedTime(walletConnectedTime) {
            this[WALLET_CONNECTED_TIME] = walletConnectedTime;
            return this;
        }

        /**
         * Gets the diff.
         *
         * @returns {Number}
         */
        get diff() {
            return this[DIFF];
        }

        /**
         * Sets the Diff.
         *
         * @param {Number} diff
         * @returns {ServerState}
         */
        set diff(diff) {
            this[DIFF] = diff;
            return this;
        }

        /**
         * Gets the state string.
         *
         * @returns {String}
         */
        get state() {
            return this[STATE];
        }

        /**
         * Sets the state.
         *
         * @param {String} state
         * @returns {ServerState}
         */
        set state(state) {
            this[STATE] = state;
            return this;
        }

        /**
         * Gets the most recent error message.
         *
         * @returns {String|null}
         */
        get errorMessage() {
            return this[ERROR_MESSAGE];
        }

        /**
         * Gets the date of the last refresh.
         *
         * @returns {Number}
         */
        get lastRefresh() {
            return this[LAST_REFRESH];
        }

        /**
         * Sets the date of the last refresh.
         *
         * @param {Number} lastRefresh
         * @returns {ServerState}
         */
        set lastRefresh(lastRefresh) {
            this[LAST_REFRESH] = lastRefresh;
            return this;
        }

        /**
         * Sets the error. If the clear flag is set, the current data is wiped.
         *
         * @param {String} state
         * @param {String} message
         * @param {boolean} clear
         */
        setError(state, message, clear)
        {
            this[STATE] = state;
            this[ERROR_MESSAGE] = message;
            this[LAST_REFRESH] = Math.floor(new Date().getTime() / 1000);

            if(clear) {
                this[HASHRATE] = 0;
                this[ACCEPTED] = 0;
                this[REJECTED] = 0;
                this[FAILED] = 0;
                this[UPTIME] = 0;
                this[EXTRA_PAYLOAD] = '';
                this[STRATUM_SERVER] = '';
                this[STRATUM_USER] = '';
                this[DIFF] = 0.0;
            }
        }

        /**
         * Clears the error.
         */
        clearError() {
            this[STATE] = ServerState.STATE_SUCCESS();
            this[ERROR_MESSAGE] = null;
        }

        /**
         * Gets a serialized version.
         *
         * @returns {Object}
         */
        serialize()
        {
            return Utility.serialize(this, CONFIG, STATE, HASHRATE,
                ACCEPTED, REJECTED, FAILED, UPTIME, EXTRA_PAYLOAD,
                STRATUM_SERVER, STRATUM_USER, DIFF, STATE, ERROR_MESSAGE, LAST_REFRESH,
                WALLET_CONNECTED, WALLET_CONNECTED_TIME
            );
        }
    }

    return ServerState;
})();

