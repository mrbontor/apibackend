const fs = require('fs');
const iniParser = require('./libs/iniParser')
const args = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser')
const express = require('express')
const env = process.env.NODE_ENV || 'development'
const logging = require('./libs/logging')
const app = express()

process.env.TZ = 'Asia/Jakarta'
// default config if config file is not provided
let config = {
    app: {
        host: '0.0.0.0',
        port: 2021
    },
    log: {
        path: 'var/log/',
        level: 'debug',
        type: 'console',
        errorSufix: '-error',
        filename: 'api-service'
    },
}

if (args.h || args.help) {
    // TODO: print USAGE
    console.log("Usage: node " + __filename + " --config");
    process.exit(-1);
}

// overwrite default config with config file
let configFile = (env === 'production') ? args.c || args.config || './configs/config.api.prod.ini' : args.c || args.config || './configs/config.api.dev.ini'
config = iniParser.init(config, configFile, args)
config.log.level = args.logLevel || config.log.level

const take_port = config.app.port;
const port = take_port || process.env.PORT;

// Initialize logging library
logging.init({
    type: config.log.type,
    path: config.log.path,
    level: config.log.level,
    filename: config.log.filename
})

logging.info(`[CONFIG] ${JSON.stringify(iniParser.get())}`)

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(err, req, res, next) {
    if (err) {
        logging.error('[MIDDLEWAREERROR] ' + JSON.stringify(err));
        res.status(500);
        let response = {
            status: 500,
            errors: [err.message]
        };
        res.json(response);
    } else {
        next();
    }
});


const routes = require('./router/router');
routes(app);

app.listen(port);
logging.info('[app] API-SERVICE STARTED on ' + port);
