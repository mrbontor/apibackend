'use strict';
const util = require('../../libs/utils');
module.exports = (sequelize, DataTypes) => {
    const IB = sequelize.define('IB', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        nab_amount: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 1
        },
        assets: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            get(){
                return util.formatDateStandard(this.getDataValue('created_at'), true)
            }
        },
        updated_at: {
            type: DataTypes.DATE,
            get(){
                return util.formatDateStandard(this.getDataValue('updated_at'), true)
            }
        }
    }, {
        tableName: 'investment_balance',
        timestamps: false,
        underscored: true,
    });

    return IB;
}
