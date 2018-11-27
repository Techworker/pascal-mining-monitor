# PascalCoin Mining Monitor Server

This software can be used to monitor your miners mining PascalCoin.

It provides 3 ways to configure your miner servers:

 - Manual configuration for each server
 - Auto-Discovery using wildcards (192.168.0.* or 192.168.0.[1;2;3] or 192.168.0.(1-3))
 - Proxying the miner wallet and checking for TCP connections
 
The server in configured with a file named `config.ini` which should reside in 
the same folder as the executable.

The server has no frontend, but it provides 2 methods to grab the collected
data and display it:

 - The server can provide the data via HTTP REST in JSON format
 - The server can run a websocket server that you can listen to

## Configuration

Copy the `config.ini.dist` to `config.ini` and start to adjust the settings.

### Global settings

Each server has a set of common settings which are applied, if the server itself
does not have a configuration value set. It will become clearer later.

**`timeout`**

This is the timeout in seconds for requests to the miner - default is 3 seconds.
If one server gets a lot of timeouts but your miner is indeed running perfectly 
fine, try to configure the server explicitly and higher the timeout value.

**`interval`**
 
The interval in seconds in which the miner gets requested for data. For RHMiner
this value should not be below 10s since rhminer only refreshes its own data 
every 10s.

**`mark_down_after`**

The number of failed requests after the miner server gets marked as down. If a
does not respond after `mark_down_after` requests, the request interval will be
changed. See next setting `retry_after_down`.

**`retry_after_down`**

When the server is marked as down, instead of requesting it every `interval` 
seconds, the request interval is altered to this value. 

Consider this configuration:

`mark_down_after = 5`
`interval = 20`
`retry_after_down` = 600

If the server does not respond after 5 requests each 20 seconds, the next try 
will occur in 10 minutes (600 seconds). If it responds after 10 minutes, the
interval is resetted to 20 seconds again.

**`port`**

The port used to query miners which is 7111 by default.

### Wallet configuration

To fetch data from the wallet (current block, last mined block, number of accounts, balance)
etc. you can set the following configuration values:

```
[wallet]
enabled = true
interval = 5;
ip = 127.0.0.1
port = 4003
b58_pubkey =
```

**`interval`**

The interval in which the wallet is requested.

**`ip`**

The IP of the wallet.

**`port`**

The port of the JSON RPC API in the wallet.

**`b58_pubkey`**

The key you are mining to. If you leave this empty, the balance and number of 
accounts is determined with all keys.

The data is made available via webserver or websockets.


### Server Settings

As said above, servers can be configured in multiple ways which are described 
below.

#### Manual configuration

Each server can be added manually, which gives you granular control about each 
miner. To enable manual configuration, set the following directive:

```
[server]
enabled = true
```

Now you can add multiple servers.

```
[server.basement_1]
ip = 192.168.1.27
;timeout = 3
;interval = 10
;mark_down_after = 30
;retry_after_down = 10
;port = 7111

[server.basement_2]
ip = ...
```
As you can see, you can configure the server with the same parameters as used 
in the global configuration. All these parameters are optional (except IP), if
they are omitted, the global values will be used.

#### Discovery

You can use discovery wildcards to add multiple servers at once. This limits
granular configuration but helps a lot when running mining farms.

To enable discovery configuration, set the following directive:

```[discovery]
enabled = false
```

Now you can add multiple discoveries:

```
[discovery.my_subnet]
pattern = 192.168.2.*
;timeout = 3
;interval = 10
;mark_down_after = 30
;retry_after_down = 10
;port = 7111
```

Again, you can configure the servers with the same parameters as used 
in the global configuration. All these parameters are optional (except pattern). 
If they are omitted, the global values will be used.

There are 3 ways to set patterns:

**Wildcard (\*)**

Set a wildcard at a position and it will loop all possible IP ranges.

`192.168.2.*` will generate 
 - 192.168.2.0
 - 192.168.2.1
 - 192.168.2.2
 - .. 
 - 192.168.2.255

**Range (-)**

Set a range at a position and it will generate IPs based on this range:

`192.168.2.(10-20)` will generate 
 - 192.168.2.10
 - 192.168.2.11
 - 192.168.2.12
 - .. 
 - 192.168.2.20

**Pick (;)**

Set a number of different values at a position and it will generate IPs based 
on this:

`192.168.2.[1;7;10]` will generate 
 - 192.168.2.1
 - 192.168.2.7
 - 192.168.2.10
 
#### Proxying

Another possibility to auto-detect miners is to proxy requests to the wallet
through this software. Whenever a miner connects to the wallet, the connection
will be intercepted and forwarded to the wallet and vice versa.

This is an interesting feature, but can also be dangerous and your miners will
rely on the server to run 100%. If this server fails, all miners will fail.

To enable proxy detection set the following directive:

```
[proxy]
enabled = true
```

Then extend the `[proxy]` config with a proper configuration.

```
[proxy]
enabled = true
proxy_ip = 0.0.0.0
proxy_port = 4009
wallet_ip = 127.0.0.1
wallet_port = 4010
;port = 7111
;timeout = 3
;interval = 10
;mark_down_after = 3
;retry_after_down = 10
```

**`proxy_ip`**

This be set to 0.0.0.0 so others can reach the proxy from the network.

**`proxy_port`**

The port to accept connections. This should be set 4009 which is the wallets 
miner port.

**`wallet_ip`**

The IP of the miner wallet where incoming connections are forwarded to.  

**`wallet_port`**

The port the connections will be forwarded to. You should change the Port in the 
wallets settings, for instance to 4010.

And one last time, you can configure the proxy with the same parameters as used 
in the global configuration. All these parameters are optional (except proxy_ip, proxy_port, wallet_ip and wallet_port). 
If they are omitted, the global values will be used.

### Getting Server Data

The data can be retrieved in 2 ways:

 - HTTP REST interface (WebServer)
 - WebSockets

#### Webserver
 
To enable the webserver, you need to set the following configuration values:

```
[webserver]
enabled = true
port = 8080
ip = 0.0.0.0
```

**`port`**

The port you want the webserver to be accessible through. 

**`ip`**

The binded IP address.


With the settings above, you can grab the data via http://127.0.0.1:8080. 

#### WebSocket

To enable the websocket feature, you can use the following configuration
values:

```
[websocket]
enabled = true
port = 8081
ping = 30
```

**`port`**

The port the websocket is available.

**`ping`**

The interval in which clients are pinged (specified in the WebSocket protocol),
to make sure invalid connections are closed.


When connecting to the websocket, you'll get 2 messages:

 1. `wallet.init` with the current wallet data
 2. `server.init` with the currently available servers

After that, you'll get a `servers.refresh` with the data of one server whenever
something changes (different hashrate, offline etc.).
 

You'll get a `wallet.refresh` event every `[wallet]interval` seconds with the 
current wallet data.

### Server JSON Format

```json
    {
      "config": {
        "ip": "127.0.0.1",
        "port": 7111,
        "timeout": 3,
        "interval": 10,
        "discovery": null,
        "mark_down_after": 10,
        "retry_after_down": 30
      },
      "state": "error",
      "hashrate": 0,
      "accepted": 0,
      "rejected": 0,
      "failed": 0,
      "uptime": 0,
      "extra_payload": "",
      "stratum.server": "",
      "stratum.user": "",
      "diff": 0,
      "error_message": "Error: connect ECONNREFUSED 127.0.0.1:7111",
      "last_refresh": 1543332923,
      "wallet_connected": false,
      "wallet_connected_time": 0
    }
```

### Wallet JSON Format

```json
{
    "config": {
      "ip": "127.0.0.1",
      "port": 4003,
      "interval": 5,
      "b58_pubkey": ""
    },
    "number_of_accounts": 123,
    "balance": 500.0000,
    "block": [
      {
        "block": 264108,
        "enc_pubkey": "CA022000D51DAA4C711B08B12A24DED7BA79D3F84C3A9223EBCF326C14D40837817E6FA220004EB54482967E135BDE323C8A7F2130DC8D785B7824037142DFB899C3FAD63F51",
        "reward": 50,
        "fee": 0,
        "ver": 4,
        "ver_a": 4,
        "timestamp": 1543331860,
        "target": 507594272,
        "nonce": 3788643597,
        "payload": "coinotron---------0800003BA743BE53",
        "sbh": "263A9876696B09CC0BBA32ABD151359390F57A1AA914F0E9C7FB934990F539EF",
        "oph": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        "pow": "0000000348905EB459F8CE0BE0D222ACD36287274F38DD2E25BFB881B0488FD8",
        "hashratekhs": 5307,
        "maturation": 0,
        "operations": 0
      }
    ],
    "active_block": 264109,
    "error_message": null,
    "state": "success",
    "last_refresh": 1543332939
  }
```