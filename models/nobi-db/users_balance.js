'use strict';
const util = require('../../libs/utils');
module.exports = (sequelize, DataTypes) => {
    const UB = sequelize.define('UB', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            unique: true,
        },
        amount: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        assets: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        ib: {
            type: DataTypes.FLOAT(20, 2),
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
        tableName: 'users_balance',
        timestamps: false,
        underscored: true,
    });

    UB.associate =  function associate(models) {
        UB.belongsTo(models.User, {
            foreignKey: 'user_id'
        })
    }

    return UB;
}
