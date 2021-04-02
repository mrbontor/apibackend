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
        created_at: DataTypes.STRING(20),
        updated_at: DataTypes.STRING(20),
        status: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'users',
        timestamps: false,
        underscored: true,
    });

    User.associate =  function associate(models) {
        User.belongsTo(models.UB, {
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
