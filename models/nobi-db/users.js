'use strict';
const util = require('../../libs/utils');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        firstname: DataTypes.STRING(30),
        lastname: DataTypes.STRING(30),
        username:{
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0,
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
        tableName: 'users',
        timestamps: false,
        underscored: true,
    });

    User.associate =  function associate(models) {
        User.hasOne(models.UB, {
            foreignKey: 'user_id',
            allowNull: false
        })

        User.hasMany(models.Transaction, {
            foreignKey: 'user_id',
            allowNull: false
        })
    }
    return User;
}
