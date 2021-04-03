const logging = require('../libs/logging')
const util = require('../libs/utils')
const nobi = require('../libs/Nobi')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require('../models/nobi-db/')

function createUser(data) {
    return new Promise(function (resolve, reject) {
        models.User
        .create(data)
        .then(function (callback) {
            logging.info(`[createUser] >>>> ${JSON.stringify(callback)}`)
            resolve(callback)
        })
        .catch(function (err) {
            if (err) reject(false)
            logging.error(`[createUser Err] >>>> ${JSON.stringify(err.stack)}`)
        })
    })
}

function getUsers() {
    return new Promise(function (resolve, reject) {
        models.User
        .findAll({
            attributes: [
                ['id', 'id'], [Sequelize.fn('concat', Sequelize.col('firstname'), ' ',Sequelize.col('lastname')), 'name'],
                ['username', 'username'], ['updated_at', 'updated_at']
            ],
            // order: [['item', 'DESC']],
        })
        .then(function (data) {
            logging.info(`[getUsers] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[getUsers Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })
}

function findUserById(id) {
    return new Promise(function (resolve, reject) {
        models.User
        .findOne({
            attributes: [
                ['id', 'id'], [Sequelize.fn('concat', Sequelize.col('firstname'), ' ',Sequelize.col('lastname')), 'name'],
                ['username', 'username'], ['updated_at', 'updated_at']
            ],
            where: { id: id}
        })
        .then(function (data) {
            logging.info(`[findUserById] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[findUserById Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })
}

function findUserByUsername(username) {
    return new Promise(function (resolve, reject) {
        models.User
        .findOne({
            attributes: [
                ['id', 'id'], [Sequelize.fn('concat', Sequelize.col('firstname'), ' ',Sequelize.col('lastname')), 'name'],
                ['username', 'username'], ['updated_at', 'updated_at']
            ],
            where: { username: username}
        })
        .then(function (data) {
            logging.info(`[findUserByUsername] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[findUserByUsername Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })
}

function getInfoUserBalance(user_id){
    return new Promise(function (resolve, reject) {
        models.User
        .findOne({
            attributes: [[Sequelize.fn('concat', Sequelize.col('firstname'), ' ',Sequelize.col('lastname')), 'name']],
            include: [
                {
                    model: models.UB,
                    attributes: ["user_id","amount", "assets", "ib"],
                    where: { user_id: user_id }
                }
            ],
            raw: true
        })
        .then(function (data) {
            logging.info(`[getInfoUserBalance] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[getInfoUserBalance Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })

}

function getTotalUserBalance(){
    return new Promise(function (resolve, reject) {
        models.UB
        .findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
                [Sequelize.fn('SUM', Sequelize.col('assets')), 'totalUnit'],
                [Sequelize.fn('SUM', Sequelize.col('ib')), 'totalBalance']
            ],
            raw: true
        })
        .then(function (data) {
            logging.info(`[getTotalUserBalance] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[getTotalUserBalance Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })

}

function addIB(data) {
    return new Promise(function (resolve, reject) {
        models.IB
        .create(data)
        .then(function (callback) {
            logging.info(`[addIB] >>>> ${JSON.stringify(callback)}`)
            resolve(callback)
        })
        .catch(function (err) {
            if (err) reject(reData)
            logging.error(`[addIB Err] >>>> ${JSON.stringify(err.stack)}`)
        })
    })
}

function getCurrentIB() {
    return new Promise(function (resolve, reject) {
        models.IB
        .findAll({
            limit: 1,
            order: [['created_at', 'DESC']],
        })
        .then(function (data) {
            logging.info(`[getCurrentIB] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[getCurrentIB Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })
}

function getListIB() {
    return new Promise(function (resolve, reject) {
        models.IB
        .findAll({
            attributes: [
                ['nab_amount', 'nab'],
                ['created_at', 'date']
            ],
            raw: true,
            order: [['created_at', 'DESC']],
        })
        .then(function (data) {
            logging.info(`[getListIB] >>>> ${JSON.stringify(data)}`)

            resolve(data)
        })
        .catch(function (err) {
            logging.error(`[getListIB Err] >>>> ${JSON.stringify(err.stack)}`)
            if (err) reject(false)
        })
    })
}

function createTransaction(data) {
    return new Promise(function (resolve, reject) {
        models.Transaction
        .create(data)
        .then(function (callback) {
            logging.info(`[createTransaction] >>>> ${JSON.stringify(callback)}`)
            resolve(callback)
        })
        .catch(function (err) {
            if (err) reject(reData)
            logging.error(`[createTransaction Err] >>>> ${JSON.stringify(err.stack)}`)
        })
    })
}

async function balanceUpdate(dataTrx, dataBalance, dataNab = 0) {
    const t = await models.sequelize.transaction();
    try {

        let trx = await models.Transaction.create(dataTrx)

        let blc = await models.UB.upsert(dataBalance)
        // let nab = await models.IB.create(dataNab)

        await t.commit()

        console.log(JSON.stringify([trx, blc]));
        return [trx, blc]

    } catch (e) {
        logging.error(`[balanceUpdate Err] ${e.stack}`);
        await t.rollback()
        return false
    }

}

function getPagination(page, size) {
    let limit = size ? +size : 20;
    let offset = page ? page * limit : 0;

    return { limit, offset };
}

function getPagingData(data, page, limit) {
    let { count: totalItems, rows: members } = data;
    let currentPage = page ? +page : 0;
    let totalPages = Math.ceil(totalItems / limit);

    return { totalItems, members, totalPages, currentPage };
};

function getAllBalance(condition, limit, offset) {
    return new Promise(function (resolve, reject) {
        models.UB.
        findAndCountAll({
            where: condition, limit, offset,
            raw: true
        })
        .then(async data => {
            let currentNAB = await getCurrentIB()
            // console.log(data);
            let redata = data.rows.map((el) => {
                
                let tunit = nobi.getUnit(el.assets, currentNAB[0].nab_amount)
                let newdata = {
                    user_id: el.user_id,
                    total_unit: el.assets,
                    total_balance: nobi.getIB(el.assets, currentNAB[0].nab_amount),
                    current_NAB: currentNAB[0].nab_amount
                }
                return newdata;
            });
            data.rows = redata
            resolve(data)
        })
        .catch(err => {
            if (err) reject(false)
            logging.error(`[getAllBalance Err] >>>> ${JSON.stringify(err.stack)}`)
        });
    })
}

module.exports = {
    createUser,
    getUsers,
    findUserById,
    findUserByUsername,

    getInfoUserBalance,
    getTotalUserBalance,
    addIB,
    getCurrentIB,
    getListIB,
    balanceUpdate,
    createTransaction,

    getAllBalance,
    getPagination,
    getPagingData
};
