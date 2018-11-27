/*
 * This file is part of the PascalCoin Miner Monitor package.
 *
 * (c) Benjamin Ansbach <benjaminansbach@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
'use strict';

const EventEmitter2 = require('eventemitter2').EventEmitter2;

class Events
{
    constructor() {
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
            newListener: false,
            maxListeners: 20,
            verboseMemoryLeak: false
        });
    }

    emit(event, data) {
        this.emitter.emit(event, {
            event, data
        })
    }

    on(event, callback) {
        this.emitter.on(event, ev => callback(ev.event, ev.data));
    }
}

module.exports = new Events;