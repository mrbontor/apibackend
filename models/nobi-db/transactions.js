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
        assets: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        nab_temp: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        created_at: DataTypes.STRING(20),
        updated_at: DataTypes.STRING(20)
    }, {
        tableName: 'transactions',
        timestamps: false,
        underscored: true,
    });

    return Transaction;
}
