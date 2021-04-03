'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const ../../configs/config-sql.json = require('../../configs/config-sql.json');
const config = require('../../configs/config.json')[env]['nobi-db'];
const logging = require('../../libs/logging');

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], Object.assign({}, config, {
        pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
        }
    }));
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, Object.assign({}, config, {
        pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
        }
    }));
}

// let model = require(path.join(__dirname, file))(sequelize, Sequelize);
db.User = require(path.join(__dirname, '/users'))(sequelize, Sequelize);
db.UB = require(path.join(__dirname, '/users_balance'))(sequelize, Sequelize);
db.IB = require(path.join(__dirname, '/inves_balance'))(sequelize, Sequelize);
db.Transaction = require(path.join(__dirname, '/transactions'))(sequelize, Sequelize);
db.sequelize = sequelize
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync()
.then(result => {
    logging.info('[MYSQL] database nobi-db connected ');
})
.catch(err => {
    logging.error('[MYSQL] connection database nobi-db failed...' + err);
});

module.exports = db;
