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

    const NUMBER_OF_ACCOUNTS = Symbol('number_of_accounts');
    const BALANCE = Symbol('balance');
    const BLOCK = Symbol('block');
    const ACTIVE_BLOCK = Symbol('active_block');
    const ERROR_MESSAGE = Symbol('error_message');
    const STATE = Symbol('state');
    const CONFIG = Symbol('config');
    const LAST_REFRESH = Symbol('last_refresh');

    /**
     * Holds the current state of the wallet.
     */
    class WalletState
    {
        /**
         * Constructor
         *
         * @param {WalletConfig} walletConfig
         */
        constructor(walletConfig)
        {
            // initialize with defaults
            this[STATE] = WalletState.STATE_INIT();
            this[NUMBER_OF_ACCOUNTS] = 0;
            this[BALANCE] = 0;
            this[ACTIVE_BLOCK] = 0;
            this[BLOCK] = null;
            this[ERROR_MESSAGE] = null;
            this[LAST_REFRESH] = Math.floor(new Date().getTime() / 1000);
            this[CONFIG] = walletConfig;
        }

        /**
         * Gets the value to indicate the init state.
         *
         * @returns {string}
         */
        static STATE_INIT() {
            return 'init';
        }

        /**
         * Gets the value to indicate the success state.
         *
         * @returns {string}
         */
        static STATE_SUCCESS() {
            return 'success';
        }

        /**
         * Gets the value to indicate the error state.
         *
         * @returns {string}
         */
        static STATE_ERROR() {
            return 'error';
        }

        /**
         * Gets the current state identifier.
         *
         * @returns {String}
         */
        get state() {
            return this[STATE];
        }

        /**
         * Sets the state identifier.
         *
         * @param {String} state
         * @returns {WalletState}
         */
        set state(state) {
            this[STATE] = state;
            return this;
        }

        /**
         * Gets the mined last block number.
         *
         * @returns {WalletState}
         */
        get activeBlock() {
            return this[ACTIVE_BLOCK];
        }

        /**
         * Sets the active block number.
         *
         * @param lastBlock
         * @returns {WalletState}
         */
        set activeBlock(lastBlock) {
            this[ACTIVE_BLOCK] = lastBlock;
            return this;
        }

        /**
         * Gets the last mined block.
         *
         * @returns {Object}
         */
        get block() {
            return this[BLOCK];
        }

        /**
         * Sets the last mined block.
         *
         * @param {Object} block
         * @returns {WalletState}
         */
        set block(block) {
            this[BLOCK] = block;
            return this;
        }

        /**
         * Gets the last error message.
         *
         * @returns {string}
         */
        get errorMessage() {
            return this[ERROR_MESSAGE];
        }

        /**
         * Sets the last error message.
         *
         * @param {String} errorMessage
         * @returns {WalletState}
         */
        set errorMessage(errorMessage) {
            this[ERROR_MESSAGE] = errorMessage;
            return this;
        }

        /**
         * Gets the current balance.
         *
         * @returns {Number}
         */
        get balance() {
            return this[BALANCE];
        }

        /**
         * Sets the current balance.
         *
         * @param {Number} balance
         * @returns {WalletState}
         */
        set balance(balance) {
            this[BALANCE] = balance;
            return this;
        }

        /**
         * Gets the number of accounts in the wallet.
         *
         * @returns {Number}
         */
        get numberOfAccounts() {
            return this[NUMBER_OF_ACCOUNTS];
        }

        /**
         * Sets the number of accounts in the wallet.
         *
         * @param numberOfAccounts
         * @returns {WalletState}
         */
        set numberOfAccounts(numberOfAccounts) {
            this[NUMBER_OF_ACCOUNTS] = numberOfAccounts;
            return this;
        }

        get lastRefresh() {
            return this[LAST_REFRESH];
        }

        set lastRefresh(lastRefresh) {
            this[LAST_REFRESH] = lastRefresh;
            return this;
        }

        /**
         * Gets the object representation of the class.
         *
         * @returns {Object}
         */
        serialize() {
            return Utility.serialize(this, CONFIG, NUMBER_OF_ACCOUNTS,
                BALANCE, BLOCK, ACTIVE_BLOCK, ERROR_MESSAGE, STATE, LAST_REFRESH
            );
        }

        /**
         * Sets the state to an error.
         *
         * @param {String} message
         */
        setError(message) {
            this.lastRefresh = Math.floor(new Date().getTime() / 1000);
            this.numberOfAccounts = 0;
            this.balance = 0;
            this.block = 0;
            this.activeBlock = null;

            this.errorMessage = message;
            this.state = WalletState.STATE_ERROR();
        }

        /**
         * Clears the last error.
         */
        clearError() {
            this.lastRefresh = Math.floor(new Date().getTime() / 1000);
            this.errorMessage = null;
            this.state = WalletState.STATE_SUCCESS();
        }
    }

    return WalletState;
})();
