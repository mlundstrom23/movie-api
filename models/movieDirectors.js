module.exports = (connection, Sequelize, Movies, Directors) => {
    return connection.define('movieDirectors', {
        movieId: { type: Sequelize.INTEGER, primaryKey: true,},
        directorId: { type: Sequelize.INTEGER, primaryKey: true,},
        movieId: { type: Sequelize.INTEGER, reference: { model: Movies, key: 'id' } },
        directorId: { type: Sequelize.INTEGER, reference: { model: Directors, key: 'id' } }
    })
}