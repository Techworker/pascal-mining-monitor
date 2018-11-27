/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const ini = require('ini');
const fs = require('fs');
const WalletConfig = require('./Config/WalletConfig');
const ProxyConfig = require('./Config/ProxyConfig');
const WebServerConfig = require('./Config/WebServerConfig');
const WebSocketConfig = require('./Config/WebSocketConfig');
const DiscoveryConfig = require('./Config/DiscoveryConfig');
const ServerConfig = require('./Config/ServerConfig');

module.exports = (function()
{
    const DEFAULT_TIMEOUT = Symbol('timeout');
    const DEFAULT_INTERVAL = Symbol('interval');
    const DEFAULT_PORT = Symbol('port');
    const DEFAULT_MARK_DOWN_AFTER = Symbol('mark_down_after');
    const DEFAULT_RETRY_AFTER_DOWN = Symbol('retry_after_down');

    const WALLET = Symbol('wallet');
    const WEBSERVER = Symbol('webserver');
    const WEBSOCKET = Symbol('websocket');
    const DISCOVERIES = Symbol('discoveries');
    const SERVERS = Symbol('servers');
    const PROXY = Symbol('proxy');

    /**
     * Constructor
     */
    class Config
    {
        /**
         * Constructor
         *
         * @param {String} configFile
         */
        constructor(configFile)
        {
            if (!fs.existsSync(configFile)) {
                throw `${configFile} file does not exist`;
            }

            // read config and check defaults
            const config = ini.parse(fs.readFileSync(configFile, 'utf-8'));

            // set global settings
            this[DEFAULT_TIMEOUT] = parseInt(config.timeout || 3, 10);
            this[DEFAULT_INTERVAL] = parseInt(config.interval || 10, 10);
            this[DEFAULT_PORT] = parseInt(config.port || 7111, 10);
            this[DEFAULT_MARK_DOWN_AFTER] = parseInt(config.mark_down_after || 20, 10);
            this[DEFAULT_RETRY_AFTER_DOWN] = parseInt(config.retry_after_down || 600, 10);

            this[DISCOVERIES] = [];
            this[WALLET] = null;
            this[SERVERS] = [];
            this[WEBSERVER] = null;
            this[WEBSOCKET] = null;
            this[PROXY] = null;

            this.initializeDiscovery(config.discovery);
            this.initializeServers(config.server);
            this.initializeWallet(config.wallet);
            this.initializeWebServer(config.webserver);
            this.initializeWebSocket(config.websocket);
            this.initializeProxy(config.proxy);
        }

        /**
         * Initializes the discovery configuration.
         *
         * @param {Object} discoveryConfig
         */
        initializeDiscovery(discoveryConfig) {
            let discoveryEnabled = !!discoveryConfig.enabled;
            if (!discoveryEnabled) {
                return;
            }

            Object.keys(discoveryConfig).forEach((ident) => {
                if (ident === 'enabled') {
                    return;
                }

                this[DISCOVERIES].push(new DiscoveryConfig(
                    discoveryConfig[ident].pattern,
                    discoveryConfig[ident].port || this[DEFAULT_PORT],
                    discoveryConfig[ident].timeout || this[DEFAULT_TIMEOUT],
                    discoveryConfig[ident].interval || this[DEFAULT_INTERVAL],
                    discoveryConfig[ident].mark_down_after || this[DEFAULT_MARK_DOWN_AFTER],
                    discoveryConfig[ident].retry_after_down || this[DEFAULT_RETRY_AFTER_DOWN]
                ));
            });
        }

        /**
         * Initializes the walet configuration.
         *
         * @param {Object} walletConfig
         */
        initializeWallet(walletConfig) {
            // initialize the wallet
            let walletEnabled = !!walletConfig.enabled;
            if (!walletEnabled) {
                return;
            }

            this[WALLET] = new WalletConfig(
                walletConfig.ip || WalletConfig.getDefaultIp(),
                walletConfig.port || WalletConfig.getDefaultPort(),
                parseInt(walletConfig.interval) || 10,
                walletConfig.b58PubKey || ''
            );
        }

        /**
         * Initializes the manual servers configuration.
         *
         * @param {Object} serverConfig
         */
        initializeServers(serverConfig) {
            // initialize the fixed servers
            let serversEnabled = !!serverConfig.enabled;
            if (!serversEnabled) {
                return;
            }
            Object.keys(serverConfig).forEach((ident) => {
                if (ident === 'enabled') {
                    return;
                }

                this[SERVERS].push(new ServerConfig(
                    serverConfig[ident].ip,
                    serverConfig[ident].port || this[DEFAULT_PORT],
                    serverConfig[ident].timeout || this[DEFAULT_TIMEOUT],
                    serverConfig[ident].interval || this[DEFAULT_INTERVAL],
                    serverConfig[ident].mark_down_after || this[DEFAULT_MARK_DOWN_AFTER],
                    serverConfig[ident].retry_after_down || this[DEFAULT_RETRY_AFTER_DOWN]
                ));
            });
        }

        /**
         * Initializes the webserver config.
         *
         * @param {Object} webServerConfig
         */
        initializeWebServer(webServerConfig)
        {
            // initialize the wallet
            let webserverEnabled = !!webServerConfig.enabled;

            // if an IP is given we will add a wallet
            if (!webserverEnabled) {
                return;
            }
            this[WEBSERVER] = new WebServerConfig(
                webServerConfig.ip,
                parseInt(webServerConfig.port, 10) || 8080,
            )
        }

        /**
         * Initializes the websocket config.
         *
         * @param {Object} webSocketConfig
         */
        initializeWebSocket(webSocketConfig)
        {
            // initialize the wallet
            let websocketEnabled = !!webSocketConfig.enabled;

            if (!websocketEnabled) {
                return;
            }

            this[WEBSOCKET] = new WebSocketConfig(
                parseInt(webSocketConfig.port, 10) || 8081,
                parseInt(webSocketConfig.ping, 10) || 30,
            )
        }

        /**
         * Initializes the websocket config.
         *
         * @param {Object} proxyConfig
         */
        initializeProxy(proxyConfig)
        {
            // initialize the wallet
            let proxyEnabled = !!proxyConfig.enabled;

            if (!proxyEnabled) {
                return;
            }

            this[PROXY] = new ProxyConfig(
                proxyConfig.proxy_ip || '0.0.0.0',
                parseInt(proxyConfig.proxy_port, 10) || 4009,
                proxyConfig.wallet_ip || '127.0.0.1',
                parseInt(proxyConfig.wallet_port, 10) || 4009,
                proxyConfig.port || this[DEFAULT_PORT],
                proxyConfig.timeout || this[DEFAULT_TIMEOUT],
                proxyConfig.interval || this[DEFAULT_INTERVAL],
                proxyConfig.mark_down_after || this[DEFAULT_MARK_DOWN_AFTER],
                proxyConfig.retry_after_down || this[DEFAULT_RETRY_AFTER_DOWN]
            )
        }


        /**
         * Gets the wallet configuration.
         *
         * @returns {WalletConfig}
         */
        get wallet() {
            return this[WALLET];
        }

        /**
         * Gets the proxy configuration.
         *
         * @returns {ProxyConfig}
         */
        get proxy() {
            return this[PROXY];
        }

        /**
         * Gets the webserver configuration.
         *
         * @returns {WebServerConfig|null}
         */
        get webServer() {
            return this[WEBSERVER];
        }

        /**
         * Gets the websocket configuration.
         *
         * @returns {WenSocketConfig|null}
         */
        get webSocket() {
            return this[WEBSOCKET];
        }

        /**
         * Gets the discovery config.
         *
         * @returns {DiscoveryConfig[]}
         */
        get discoveries() {
            return this[DISCOVERIES];
        }

        /**
         * Gets the server config.
         *
         * @returns {ServerConfig[]}
         */
        get servers() {
            return this[SERVERS];
        }
    }

    return Config;
})();