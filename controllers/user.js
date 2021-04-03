const fs = require('fs');
const Ajv = require('ajv');
const iniParser = require('../libs/iniParser')
const logging = require('../libs/logging')
const util = require('../libs/utils')
const db = require('./dbController');

const createUser_ = JSON.parse(fs.readFileSync('./schema/createUser.json'))
const updateUser_ = JSON.parse(fs.readFileSync('./schema/updateUser.json'))

let config = iniParser.get()
//show All error if data not valid
const ajv = new Ajv.default({
    allErrors: false,
    loopRequired: Infinity
}); // options can be passed, e.g. {allErrors: true}

const SUCCESS           = 200
const BAD_REQUEST       = 400
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const INTERNAL_ERROR    = 500

//create user function
async function createUser(req, res) {
    let respons = {status: false, message: "Failed"}
    try {
        let _request = req.body
        logging.debug(`[Payload] >>>> ${JSON.stringify(_request)}`)

        let isRequestValid = await isRequestValidated(_request, 'create')
        logging.debug(`[isRequestValid] >>>> TRUE =>FALSE || FALSE => TRUE ${JSON.stringify(isRequestValid)}`)

        if (isRequestValid.message){
            respons.message = isRequestValid.message.message
            return res.status(BAD_REQUEST).send(respons);
        }

        let isExistName = await db.findUserByUsername(_request.username)
        if (isExistName) {
            respons.message = 'The username already used'
            return res.status(BAD_REQUEST).send(respons)
        }

        let now = util.formatDateStandard(new Date(), true)
        _request.created_at = now
        _request.updated_at = now

        let store = await db.createUser(_request)
        if (!store) {
            respons.message = 'Failed to add new user'
            return res.status(BAD_REQUEST).send(respons);
        }

        respons = {
            status: true,
            message: 'Success',
            data: store
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.debug(`[createUser]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//get all users function
async function getUsers(req, res) {
    let respons = {status: false, message: "Failed"}
    try {
        let getUsers = await db.getUsers()
        if (getUsers.length == 0) {
            respons.message = 'No data found'
            return res.status(BAD_REQUEST).send(respons)
        }

        respons = {
            status: true,
            message: 'Success',
            data: getUsers
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.error(`[getUsers Err]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//find user by id
async function findUser(req, res) {
    let respons = {status: false, message: "Failed"}
    try {
        let id_ = req.params.id

        let isExist = await db.findUserById(id_)
        if (!isExist) {
            respons.message = 'Data not found'
            return res.status(BAD_REQUEST).send(respons)
        }

        respons = {
            status: true,
            message: 'Success',
            data: isExist
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.debug(`[findUser]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

//update user function
async function updateUser(req, res) {
    let respons = {status: false, message: "Failed"}
    try {
        let _request = req.body
        logging.debug(`[Payload] >>>> ${JSON.stringify(_request)}`)

        let id_ = req.params.id
        let isRequestValid = await isRequestValidated(_request, 'update')
        logging.debug(`[isRequestValid] >>>> TRUE =>FALSE || FALSE => TRUE ${JSON.stringify(isRequestValid)}`)

        if (isRequestValid.message){
            respons.message = isRequestValid.message.message
            return res.status(BAD_REQUEST).send(respons);
        }

        let isExistUser = await db.findUserById(id_)
        if (!isExistUser) {
            respons.message = 'Data not found'
            return res.status(BAD_REQUEST).send(respons)
        }

        let isExistUsername = await db.findServer(_request.username)
        if (isExistUsername.username && isExistUsername.id != id_) {
            respons.message = 'The username is already used.'
            return res.status(BAD_REQUEST).send(respons)
        }

        _request.updated_at = util.formatDateStandard(new Date(), true)

        let store = await db.updateUser(id_, _request)
        if (store.length == 0) {
            respons.message = 'Failed to update new server'
            return res.status(BAD_REQUEST).send(respons);
        }

        respons = {
            status: true,
            message: 'Success',
            data: _request
        }
        res.status(SUCCESS).send(respons)
    } catch (e) {
        logging.error(`[updateUser Err]   >>>>> ${e.stack}`)
        res.status(BAD_REQUEST).send(respons)
    }
}

async function isRequestValidated(request, type) {
    let result = {}
    let valid
    switch (type) {
        case 'create':
            valid = ajv.validate(createUser_, request);
            break;
        default:
            valid = ajv.validate(updateUser_, request)
    }
    logging.debug(`[ValidateRequest] >>>> ${JSON.stringify(ajv.errors)}`)

    if (!valid) {
        result = util.handleErrorValidation(ajv.errors);
    }
    return Promise.resolve(result);
}

module.exports = {
    createUser,
    getUsers,
    findUser,
    updateUser
};
