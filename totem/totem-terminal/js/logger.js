const winston = require('winston');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const dateStampedFilename = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    return path.join('logs', `log-${currentDate}.log`);
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [
        new winston.transports.File({
            filename: dateStampedFilename(),
            maxSize: 10485760,
            maxFiles: 30,
            tailAble: true,
            format: winston.format.combine(winston.format.timestamp(), logFormat)
        })
    ]
});

module.exports = logger;