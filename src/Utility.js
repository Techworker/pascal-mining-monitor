/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

class Utility
{
    /**
     * A simple function that can transform simple IP patterns to a list of IPS.
     *
     * Supoorted:
     *  - Use `*` (star) to generate IP-parts from 0-255
     *  - Use `(n-m)` to generate IP-parts from n to m
     *  - Use `[a;b;c]` to generate Use the given IP parts.
     *
     * For example 192.168.1.* will generate 192.168.1.0, 192.168.1.1 ...192.168.1.255
     * For example 192.168.1.(10-20) will generate 192.168.1.10, 192.168.1.11 ...192.168.1.20
     * For example 192.168.1.(1;2;15) will generate 192.168.1.1, 192.168.1.2 and 192.168.1.15
     *
     * @param {String} pattern
     * @returns {Array}
     */
    static generateIpV4FromPattern(pattern)
    {
        // the list of generated IPs
        let ips = [];

        // extract parts
        const parts = pattern.split('.').map((v => v.trim()));

        // a collection of all IP part combinations
        const list = [[],[],[],[]];

        parts.forEach((part, idx) => {
            part = part.trim();
            if(part === '*') {
                for (let i = 0; i <= 255; i++) {
                    list[idx].push(i);
                }
            } else if(part[0] === '(') {
                let fromTo = part.substr(1, part.length - 2).split('-').map(x => parseInt(x, 10));
                for (let i = fromTo[0]; i <= fromTo[1]; i++) {
                    list[idx].push(i);
                }
            } else if(part[0] === '[') {
                let items = part.substr(1, part.length - 2).split(';').map(x => parseInt(x, 10));
                items.forEach((i) => list[idx].push(i));
            } else {
                list[idx].push(part);
            }
        });

        list[0].forEach((l1) => {
            list[1].forEach((l2) => {
                list[2].forEach((l3) => {
                    list[3].forEach((l4) => {
                        ips.push(`${l1}.${l2}.${l3}.${l4}`);
                    });
                });
            });
        });

        return ips;
    }

    static serialize(object, ...symbols)
    {
        const serialized = {};
        symbols.forEach((symbol) => {
            if(object[symbol] instanceof Object && object[symbol].serialize !== undefined) {
                serialized[symbol.toString().slice(7,-1)] = object[symbol].serialize();
            } else {
                serialized[symbol.toString().slice(7,-1)] = object[symbol];
            }
        });

        return serialized;
    }
}

module.exports =  Utility;