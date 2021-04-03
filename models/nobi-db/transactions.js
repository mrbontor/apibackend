'use strict';
const util = require('../../libs/utils');
module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: DataTypes.INTEGER(11),
        type: DataTypes.STRING(10),
        amount: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        assets_temp: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        nab_temp: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        ib_temp: {
            type: DataTypes.FLOAT(20, 2),
            allowNull: false,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            get(){
                return util.formatDateStandard(this.getDataValue('created_at'), true)
            }
        }
    }, {
        tableName: 'transactions',
        timestamps: false,
        underscored: true,
    });

    return Transaction;
}
