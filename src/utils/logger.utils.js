const { createLogger, format, transports } = require('winston');

var serverLogger = createLogger({
    transports:
        new transports.File({
            filename: 'logs/server.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
});

const authLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/auth.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        })
    ]
})

const uploadLogger = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/upload.log',
            format: format.combine(
                format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        })
    ]
})

module.exports = {
    serverLogger: serverLogger,
    authLogger: authLogger,
    uploadLogger: uploadLogger
}