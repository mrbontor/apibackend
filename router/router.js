module.exports = function(app) {
    const user = require('../controllers/user');
    const trx = require('../controllers/transaction');

    app.route('/api/v1/user/add')
        .post(user.createUser)

    app.route('/api/v1/user/list')
        .get(user.getUsers)

    app.route('/api/v1/user/find/:id')
        .get(user.findUser)

    app.route('/api/v1/user/update/:id')
        .put(user.updateUser)

    app.route('/api/v1/ib/updateTotalBalance')
        .post(trx.updateTotalBalance)

    app.route('/api/v1/ib/listNAB')
        .get(trx.getListIB)

    app.route('/api/v1/ib/topup')
        .post(trx.topUpBalance)

    app.route('/api/v1/ib/withdraw')
        .post(trx.withdrawBalance)

    app.route('/api/v1/ib/member')
        .get(trx.listBalance)

    app.get('/api/v1/ping', function (req, res) {
        res.status(200).json({status: true, message: "How are you? i`m Fine. Thanks "})
    })
};
