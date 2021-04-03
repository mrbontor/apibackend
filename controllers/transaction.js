const fs = require('fs');
const Ajv = require('ajv');
const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const util = require('../libs/utils')
const db = require('./dbController');
const nobi = require('../libs/Nobi');

const topUp = JSON.parse(fs.readFileSync('./schema/topup.json'))
const withdraw = JSON.parse(fs.readFileSync('./schema/withdraw.json'))

let config = iniParser.get()
//show All error if data not valid
const ajv = new Ajv.default({
    allErrors: false,
    loopRequired: Infinity
}); // options can be passed, e.g. {allErrors: true}

const NAB_DEFAULT       = config.nab.default
const SUCCESS           = 200
const BAD_REQUEST       = 400
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const INTERNAL_ERROR    = 500

async function updateTotalBalance(req, res) {
    let respons = {status: false, message: "Something went wrong"}
    try {
        let _request = req.body.current_balance
        if (typeof _request === 'undefined' && !util.isNumeric(_request)) {
            respons.message = 'current_balance is required and should be number'
            return res.status(BAD_REQUEST).send(respons);
        }
        let currenIB = NAB_DEFAULT

        let getTotalBalance = await db.getTotalUserBalance()
        if (getTotalBalance && getTotalBalance[0].totalUnit !== null) {
            currenIB = nobi.getNAB(_request, getTotalBalance[0].totalUnit)
        }

        console.log(currenIB);
        let now = util.formatDateStandard(new Date(), true)
        let dataToStore = {
            nab_amount: currenIB,
            assets: (getTotalBalance[0].totalUnit === null) ? 0 : getTotalBalance[0].totalUnit,
            created_at : now,
            updated_at : now
        }
        let store = await db.addIB(dataToStore)
        if (!store) {
            respons.message = 'Failed updated NAB'
            return res.status(BAD_REQUEST).send(respons);
        }

        respons = {
            status: true,
            message: 'Success',
            data: store
        }
        res.status(SUCCESS).send(respons)

    } catch (e) {
        logging.debug(`[updateTotalBalance]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//get all list nab
async function getListIB(req, res) {
    let respons = {status: false, message: "Something went wrong"}
    try {
        let getListIB = await db.getListIB()
        if (getListIB.length === 0) {
            respons.message = 'No data found'
            return res.status(BAD_REQUEST).send(respons)
        }

        respons = {
            status: true,
            message: 'Success',
            data: getListIB
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.error(`[getListIB Err]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//topUp function
async function topUpBalance(req, res) {
    let respons = {status: false, message: "Something went wrong"}
    try {
        let _request = req.body
        logging.debug(`[Payload] >>>> ${JSON.stringify(_request)}`)

        _request.type = 'kredit'
        let isRequestValid = await isRequestValidated(_request, 'topup')
        logging.debug(`[isRequestValid] >>>> TRUE =>FALSE || FALSE => TRUE ${JSON.stringify(isRequestValid)}`)

        if (isRequestValid.message){
            respons.message = isRequestValid.message.message
            return res.status(BAD_REQUEST).send(respons);
        }

        let isExistUser = await db.findUserById(_request.user_id)
        if (!isExistUser) {
            respons.message = 'User not found'
            return res.status(NOT_FOUND).send(respons)
        }

        let getCurrentNAB = await db.getCurrentIB()
        if (!getCurrentNAB || getCurrentNAB.length === 0) {
            respons.message = 'You need to initialization NAB first, please contact admin.'
            return res.status(BAD_REQUEST).send(respons)
        }

        let balanceUser = 0, unitUser = 0, ibUser = 0;
        let infoUser = await db.getInfoUserBalance(_request.user_id)

        balanceUser = (infoUser === null) ? 0 : infoUser["UB.amount"]
        unitUser = (infoUser === null) ? 0 : infoUser["UB.assets"]

        //get total Balance
        ibUser = nobi.getIB(unitUser, getCurrentNAB[0].nab_amount)
        console.log('u', unitUser);

        //user's unit temporary
        let unitUserTemp = nobi.getUnit(_request.amount_rupiah, getCurrentNAB[0].nab_amount)
        // calculate total unit
        let finalUnit = unitUser + unitUserTemp
        logging.debug(`[User'sUnit] >>>> POST ${_request.amount_rupiah} = ${unitUser} + ${unitUserTemp}`)
        //total user's balance
        let finalIB = nobi.getIB(finalUnit, getCurrentNAB[0].nab_amount)


        let now = util.formatDateStandard(new Date(), true)
        let dataUserBalance = {
            user_id: _request.user_id,
            amount: finalIB,
            assets: nobi.roundDown4(finalUnit),
            created_at: now
        }

        let dataUserTrx = {
            user_id: _request.user_id,
            type: _request.type,
            amount: _request.amount_rupiah,
            assets_temp: nobi.roundDown4(finalUnit),
            nab_temp: getCurrentNAB[0].nab_amount,
            ib_temp: finalIB,
            created_at: now
        }

        let store = await db.balanceUpdate(dataUserTrx,dataUserBalance)
        if (!store) {
            respons.message = 'TopUp failed, please try again'
            return res.status(BAD_REQUEST).send(respons);
        }

        respons = {
            status: true,
            message: 'Success',
            data: {
                topup: _request.amount_rupiah,
                unit: nobi.roundDown4(finalUnit),
                balance: finalIB
            }
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.debug(`[topUpBalance]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//withdraw function
async function withdrawBalance(req, res) {
    let respons = {status: false, message: "Something went wrong"}
    try {
        let _request = req.body
        logging.debug(`[Payload] >>>> ${JSON.stringify(_request)}`)

        _request.type = 'debit'
        let isRequestValid = await isRequestValidated(_request, 'withdraw')
        logging.debug(`[isRequestValid] >>>> TRUE =>FALSE || FALSE => TRUE ${JSON.stringify(isRequestValid)}`)

        if (isRequestValid.message){
            respons.message = isRequestValid.message.message
            return res.status(BAD_REQUEST).send(respons);
        }

        let isExistUser = await db.findUserById(_request.user_id)
        if (!isExistUser) {
            respons.message = 'User not found'
            return res.status(NOT_FOUND).send(respons)
        }

        let getCurrentNAB = await db.getCurrentIB()
        if (!getCurrentNAB || getCurrentNAB.length === 0) {
            respons.message = 'You need to initialization NAB first, please contact admin.'
            return res.status(BAD_REQUEST).send(respons)
        }

        let balanceUser = 0, unitUser = 0, ibUser = 0;
        let infoUser = await db.getInfoUserBalance(_request.user_id)

        balanceUser = (infoUser === null) ? 0 : infoUser["UB.amount"]
        unitUser = (infoUser === null) ? 0 : infoUser["UB.assets"]

        //get total Balance
        ibUser = nobi.getIB(unitUser, getCurrentNAB[0].nab_amount)
        console.log('u', unitUser);

        //user's unit temporary
        let unitUserTemp = nobi.getUnit(_request.amount_rupiah, getCurrentNAB[0].nab_amount)
        // calculate total unit
        let finalUnit = unitUser - unitUserTemp
        logging.debug(`[User'sUnit] >>>> POST ${_request.amount_rupiah} = ${unitUser} - ${unitUserTemp}`)
        //total user's balance
        let finalIB = nobi.getIB(finalUnit, getCurrentNAB[0].nab_amount)

        if (_request.amount_rupiah > ibUser ) {
            respons.message = 'Insuficient issue'
            return res.status(BAD_REQUEST).send(respons);
        }

        let now = util.formatDateStandard(new Date(), true)
        let dataUserBalance = {
            user_id: _request.user_id,
            amount: balanceUser - _request.amount_rupiah,
            assets: nobi.roundDown4(finalUnit),
            ib: finalIB,
            created_at: now
        }

        let dataUserTrx = {
            user_id: _request.user_id,
            type: _request.type,
            amount: _request.amount_rupiah,
            assets_temp: nobi.roundDown4(finalUnit),
            nab_temp: getCurrentNAB[0].nab_amount,
            ib_temp: finalIB,
            created_at: now
        }

        let store = await db.balanceUpdate(dataUserTrx,dataUserBalance)
        if (!store) {
            respons.message = 'TopUp failed, please try again'
            return res.status(BAD_REQUEST).send(respons);
        }

        respons = {
            status: true,
            message: 'Success',
            data: {
                topup: _request.amount_rupiah,
                unit: nobi.roundDown4(finalUnit),
                balance: finalIB
            }
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.debug(`[withdrawBalance]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//datatable user balance function
async function listBalance(req, res) {
    let respons = {status: false, message: "Something went wrong"}
    try {
        let { page, size, user_id } = req.query;
        let condition = user_id ? { user_id: { [Op.like]: `%${user_id}%` } } : null;

        let { limit, offset } = db.getPagination(page, size);

        let getData = await db.getAllBalance(condition, limit, offset)
        if (!getData) {
            respons.message = "Some error occurred while retrieving tutorials."
            return res.status(BAD_REQUEST).send(respons);
        }
        let result = await db.getPagingData(getData, page, limit);

        respons = {
            status: true,
            message: 'Success',
            data: result
        }

        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.debug(`[listBalance]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

async function isRequestValidated(request, type) {
    let result = {}
    let valid
    switch (type) {
        case 'topup':
            valid = ajv.validate(topUp, request);
            break;
        default:
            valid = ajv.validate(withdraw, request)
    }
    logging.debug(`[ValidateRequest] >>>> ${JSON.stringify(ajv.errors)}`)

    if (!valid) {
        result = util.handleErrorValidation(ajv.errors);
    }
    return Promise.resolve(result);
}

async function isRequestValidated(request, type) {
    let result = {}
    let valid
    switch (type) {
        case 'topup':
            valid = ajv.validate(topUp, request);
            break;
        default:
            valid = ajv.validate(withdraw, request)
    }
    logging.debug(`[ValidateRequest] >>>> ${JSON.stringify(ajv.errors)}`)

    if (!valid) {
        result = util.handleErrorValidation(ajv.errors);
    }
    return Promise.resolve(result);
}

module.exports = {
    updateTotalBalance,
    getListIB,
    topUpBalance,
    withdrawBalance,
    listBalance
};
