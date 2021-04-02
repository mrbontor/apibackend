module.exports = (sequelize, DataTypes) => {
    const UB = sequelize.define('UB', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: DataTypes.INTEGER(11),
        amount: {
            type: DataTypes.DECIMAL(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        assets: {
            type: DataTypes.FLOAT(20, 4),
            allowNull: false,
            defaultValue: 0
        },
        created_at: DataTypes.STRING(20),
        updated_at: DataTypes.STRING(20)
    }, {
        tableName: 'users_balance',
        timestamps: false,
        underscored: true,
    });

    return UB;
}
