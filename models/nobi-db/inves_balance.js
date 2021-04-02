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
            type: DataTypes.FLOAT(11, 4),
            allowNull: false,
            defaultValue: 1
        },
        assets: {
            type: DataTypes.FLOAT(11, 4),
            allowNull: false,
            defaultValue: 0
        },
        created_at: DataTypes.STRING(20),
        updated_at: DataTypes.STRING(20)
    }, {
        tableName: 'investment_balance',
        timestamps: false,
        underscored: true,
    });

    return IB;
}
