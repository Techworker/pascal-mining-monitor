/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const ServerConfig = require('./../Config/ServerConfig');
const ServerState = require('./../State/ServerState');
const ProxyMonitor = require('./ProxyMonitor');
const DiscoveryConfig = require('./../Config/DiscoveryConfig');
const events = require('./../Events');
const Utility = require('./../Utility');

/**
 * Monitor for the server miners.
 */
class ServerMonitor
{
    /**
     * Prefix for monitor events.
     *
     * @param {String} append
     * @returns {String}
     */
    static EV_PREFIX(append) {
        if(append !== undefined && append !== '') {
            return `server.${append}`;
        }

        return 'server';
    }

    /**
     * Refresh event.
     *
     * @returns {string}
     */
    static EV_REFRESH() {
        return ServerMonitor.EV_PREFIX('refresh');
    }

    /**
     * Constructor
     *
     * @param {DiscoveryConfig[]} discoveryConfig
     * @param {ServerConfig[]} serverConfig
     * @param request
     */
    constructor(discoveryConfig, serverConfig, request)
    {
        this.errorCounter = {};
        this.timeouts = {};
        this.request = request;
        this.serverStates = this.addServersFromDiscoveries(discoveryConfig);
        this.serverStates = this.addServersFromConfig(this.serverStates, serverConfig);

        // listen to proxy events
        events.on(ProxyMonitor.EV_CONNECTED(), (event, data) => {
            if(this.serverStates[data.ip] === undefined) {
                const serverConfig = new ServerConfig(
                    data.ip, data.config.port, data.config.timeout,
                    data.config.interval, data.config.markDownAfter,
                    data.config.retryAfterDown
                );

                this.serverStates[data.ip] = new ServerState(serverConfig);
                this.errorCounter[data.ip] = 0;
            }
            this.serverStates[data.ip].walletConnected = true;
            this.serverStates[data.ip].walletConnectedTime = Math.floor(new Date().getTime() / 1000);
            this.requestServer(this.serverStates[data.ip]);
        });
        events.on(ProxyMonitor.EV_DISCONNECTED(), (event, ip, config) => {
            if(this.serverStates[ip] !== undefined) {
                this.serverStates[ip].walletConnected = false;
                this.serverStates[ip].walletConnectedTime = 0;
                this.requestServer(this.serverStates[ip]);
            }
        });

        Object.keys(this.serverStates).forEach((ip) => {
            this.errorCounter[ip] = 0;
            this.requestServer(this.serverStates[ip]);
        });
    }

    /**
     * Determines all servers from the discovery configs and adds them to
     * the list of servers.
     *
     * @return {Object}
     */
    addServersFromDiscoveries(discoveryConfig)
    {
        const servers = {};
        discoveryConfig.forEach((discovery) => {
            /** @var discovery Discovery */
            const serverIps = Utility.generateIpV4FromPattern(discovery.pattern);
            serverIps.forEach((ip) => {
                const serverConfig = new ServerConfig(
                    ip, discovery.port, discovery.timeout,
                    discovery.interval, discovery.markDownAfter,
                    discovery.retryAfterDown
                );
                servers[ip] = new ServerState(serverConfig);
            })
        });

        return servers;
    }

    /**
     * Overwrites the generated server objects with the defined servers.
     *
     * @param {Object} existing
     * @param {ServerConfig} servers
     * @returns {Object}
     */
    addServersFromConfig(existing, servers)
    {
        servers.forEach((serverConfig) => {
            existing[serverConfig.ip] = new ServerState(serverConfig);
        });

        return existing;
    }

    requestServer(serverState) {
        this.request.request(serverState.config)
            .then(response => this.onSuccess(response))
            .catch(response => this.onError(response));
    }

    onSuccess(response)
    {
        this.errorCounter[response.server.ip] = 0;

        const relatedState = this.serverStates[response.server.ip];
        relatedState.lastRefresh = Math.floor(new Date().getTime() / 1000);
        relatedState.clearError();
        relatedState.state = ServerState.STATE_SUCCESS();
        relatedState.hashRate = response.data.speed;
        relatedState.accepted = response.data.accepted;
        relatedState.rejected = response.data.rejected;
        relatedState.failed = response.data.failed;
        relatedState.uptime = response.data.uptime;
        relatedState.extraPayload = response.data.extrapayload;
        relatedState.stratumServer = response.data['statum.server'];
        relatedState.stratumUser = response.data['statum.user'];
        relatedState.diff = response.data.diff;

        events.emit(ServerMonitor.EV_REFRESH(), this.serverStates[response.server.ip]);
        if(this.timeouts[relatedState.config.ip]) {
            clearTimeout(this.timeouts[relatedState.config.ip]);
        }
        this.timeouts[relatedState.config.ip] = setTimeout(
            () => this.requestServer(relatedState),
            relatedState.config.interval * 1000
        );
    }

    onError(response)
    {
        const relatedState = this.serverStates[response.server.ip];

        this.errorCounter[relatedState.config.ip]++;
        let interval = relatedState.config.interval;
        if(this.errorCounter[relatedState.config.ip] >= relatedState.config.markDownAfter) {
            relatedState.setError(
                response.state,
                response.msg,
                true
            );
            interval = relatedState.config.retryAfterDown;
        } else {
            relatedState.setError(
                response.state,
                response.msg,
                false
            );
        }
        events.emit(ServerMonitor.EV_REFRESH(), relatedState);
        if(this.timeouts[relatedState.config.ip]) {
            clearTimeout(this.timeouts[relatedState.config.ip]);
        }

        this.timeouts[relatedState.config.ip] = setTimeout(
            () => this.requestServer(relatedState),
            interval * 1000
        );
    }
}

module.exports = ServerMonitor;