function getNAB(t_balance, t_unit) {
    let result = parseFloat(t_balance) / parseFloat(t_unit)
    return roundDown4(result)
}

function getUnit(balance, nab) {
    let result = parseFloat(balance) / parseFloat(nab)
    return roundDown4(result) ;
}

function getIB(unit, nab) {
    let result = parseFloat(unit) * parseFloat(nab)
    return roundDown2(result) ;
}

function roundDown4(value) {
    return Math.floor(value* 10000) / 10000
}

function roundDown2(value) {
    return Math.floor(value* 100) / 100
}


module.exports = {getNAB, getUnit, getIB, roundDown4, roundDown2};
