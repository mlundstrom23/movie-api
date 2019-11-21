module.exports = (connection, Sequelize) => {
    return connection.define('directors', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true,
        },
        directors: { type: Sequelize.STRING, },
    })
}