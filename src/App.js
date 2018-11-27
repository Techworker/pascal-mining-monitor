/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const log = require('./Logger');

const Config = require('./Config');

const ServerConfig = require('./Config/ServerConfig');
const ServerMonitor = require('./Monitor/ServerMonitor');

const RHMinerRequest = require('./Requests/RHMiner');

const WalletConfig = require('./Config/WalletConfig');
const WalletState = require('./State/WalletState');
const WalletMonitor = require('./Monitor/WalletMonitor');
const WalletRequest = require('./Requests/WalletRequest');

const WebServer = require('./WebServer');
const WebServerConfig = require('./Config/WebServerConfig');

const WebSocket = require('./WebSocket');
const WebSocketConfig = require('./Config/WebSocketConfig');

const ProxyMonitor = require('./Monitor/ProxyMonitor');
const ProxyConfig = require('./Config/ProxyConfig');

const Utility = require('./Utility');

module.exports = (function()
{
    const CONFIG = Symbol('config');

    const WALLET_MONITOR = Symbol('wallet_monitor');
    const SERVER_MONITOR = Symbol('server_monitor');

    const WEBSERVER = Symbol('webserver');
    const WEBSOCKET = Symbol('websocket');
    const PROXY = Symbol('proxy');

    /**
     *
     */
    class App
    {
        /**
         *
         * @param {Config} config
         */
        constructor(config)
        {
            this[CONFIG] = config;

            this.startWebServer(config.webServer);
            this.startWebSocket(config.webSocket);
            this.startWalletMonitoring(config.wallet);
            this.startServerMonitoring(config.discoveries, config.servers);
            this.startProxyMonitoring(config.proxy);
        }

        /**
         * Starts the wallet monitoring process.
         *
         * @param {WalletConfig} config
         */
        startWalletMonitoring(config)
        {
            if(config === null) {
                return;
            }
            this[WALLET_MONITOR] = new WalletMonitor(
                new WalletState(config),
                config,
                new WalletRequest(config)
            );
        }

        /**
         * Starts the wallet monitoring process.
         *
         * @param {DiscoveryConfig[]} discoveryConfig
         * @param {ServerConfig[]} serverConfig
         */
        startServerMonitoring(discoveryConfig, serverConfig)
        {
            this[SERVER_MONITOR] = new ServerMonitor(
                discoveryConfig,
                serverConfig,
                new RHMinerRequest()
            );
        }

        /**
         * Start the webserver.
         *
         * @param {WebServerConfig} config
         */
        startWebServer(config)
        {
            if(config === null) {
                return;
            }

            this[WEBSERVER] = new WebServer(config);
        }

        /**
         * Start the proxy.
         *
         * @param {ProxyConfig} config
         */
        startProxyMonitoring(config)
        {
            if(config === null) {
                return;
            }

            this[PROXY] = new ProxyMonitor(config);
        }

        /**
         * Start the websocket server.
         *
         * @param {WebSocketConfig} config
         */
        startWebSocket(config)
        {
            if(config === null) {
                return;
            }

            this[WEBSOCKET] = new WebSocket(config);
        }
    }

    return App;

})();