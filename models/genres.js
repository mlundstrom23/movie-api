module.exports = (connection, Sequelize) => {
    return connection.define('genres', {
        id: {
            type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true,
        },
        genres: { type: Sequelize.STRING, },
    })
}