const { Model, DataTypes } = require("sequelize");

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            },
            person_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            created_by: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            removed: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            removed_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            removed_by: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            sequelize
        });
    };
}

module.exports = User;