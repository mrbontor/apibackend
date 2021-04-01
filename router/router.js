module.exports = function(app) {

    app.get('/api/v1/ping', function (req, res) {
        res.status(200).json({status: true, message: "How are you? i`m Fine. Thanks "})
    })
};
