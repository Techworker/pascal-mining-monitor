/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const WalletRequest = require('./../Requests/WalletRequest');
const events = require('./../Events');

/**
 * Monitor for the wallet. Will check the blockcount and emit wallet.* events
 * in case a new block is added.
 */
class WalletMonitor
{
    /**
     * Prefix for monitor events.
     *
     * @param {String} append
     * @returns {String}
     */
    static EV_PREFIX(append) {
        if(append !== undefined && append !== '') {
            return `wallet.${append}`;
        }

        return 'wallet';
    }

    /**
     * Refresh event.
     *
     * @returns {string}
     */
    static EV_REFRESH() {
        return WalletMonitor.EV_PREFIX('refresh');
    }

    /**
     * Creates a new instance of the Monitor.
     *
     * @param {WalletState} state
     * @param {WalletConfig} config
     * @param {WalletRequest} request
     */
    constructor(state, config, request)
    {
        this.state = state;
        this.config = config;
        this.request = request;

        // set interval to check for blocks.
        setInterval(() => this.refresh(), config.interval * 1000);

        // request directly for the first time
        this.refresh();
    }

    /**
     * Requests the number of blocks to see if a block was changed.
     */
    refresh()
    {
        this.state.clearError();
        this.request.blockCount()
            .then(blockCount => this.onBlockCount(blockCount))
            .catch(error => this.onError(error));
    }

    /**
     * Gets called when the number of blocks is returned by the node.
     *
     * @param {Number} blockCount
     */
    onBlockCount(blockCount)
    {
        // it compares the currently saved block count with the returned block count.
        if(blockCount === this.state.activeBlock) {
            return;
        }

        this.state.clearError();
        this.state.activeBlock = blockCount;
        this.request.accounts()
            .then(accountCount => this.onAccountsCount(accountCount))
            .catch(error => this.onError(error));
    }

    /**
     * Gets called with the number of accounts in the wallet.
     *
     * @param {Number} accountsCount
     */
    onAccountsCount(accountsCount)
    {
        this.state.clearError();
        this.state.numberOfAccounts = accountsCount;
        this.request.balance()
            .then(balance => this.onBalance(balance))
            .catch(error => this.onError(error));
    }

    /**
     * Gets called with the current balance.
     *
     * @param {Number} balance
     */
    onBalance(balance)
    {
        this.state.clearError();
        this.state.balance = balance;
        this.request.latestBlock()
            .then(block => this.onLatestBlock(block))
            .catch(error => this.onError(error));
    }

    /**
     * Gets called with the latest block.
     *
     * @param {Object} block
     */
    onLatestBlock(block)
    {
        this.state.clearError();
        this.state.block = block;
        events.emit(WalletMonitor.EV_REFRESH(), this.state);
    }

    /**
     * Gets called when the request was not successful.
     *
     * @param {String} error
     */
    onError(error) {
        this.state.setError(error.toString());
        events.emit(WalletMonitor.EV_REFRESH(), this.state);
    }
}

module.exports = WalletMonitor;