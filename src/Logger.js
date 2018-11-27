const winston = require('winston');

const format = winston.format.printf(info => {
    return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
});

module.exports = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        format
    ),
    transports: [
        new winston.transports.Console(),
    ]
});