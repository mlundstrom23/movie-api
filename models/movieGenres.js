module.exports = (connection, Sequelize, Movies, Genres) => {
    return connection.define('movieGenres', {
        movieId: { type: Sequelize.INTEGER, primaryKey: true,},
        genreId: { type: Sequelize.INTEGER, primaryKey: true,},
        movieId: { type: Sequelize.INTEGER, reference: { model: Movies, key: 'id' } },
        genreId: { type: Sequelize.INTEGER, reference: { model: Genres, key: 'id' } }
    })
}