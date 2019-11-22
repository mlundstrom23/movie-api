const Sequelize = require('sequelize')
const allConfigs = require('../config/sequelize')
const MoviesModel = require('./movies')
const DirectorsModel = require('./directors')
const GenresModel = require('./genres')
const movDirModel = require('./movieDirectors')
const movGenModel = require('./movieGenres')

const config = allConfigs['development']

const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
})


const Movies = MoviesModel(connection, Sequelize)
const Directors = DirectorsModel(connection, Sequelize)
const Genres = GenresModel(connection, Sequelize)
const MovieDirectors = movDirModel(connection, Sequelize, Movies, Directors)
const MovieGenres = movGenModel(connection, Sequelize, Movies, Genres) 

Movies.belongsToMany(Directors, { through: 'movieDirectors', foreignKey: 'movieId', as: 'directors' })
Directors.belongsToMany(Movies, { through: 'movieDirectors', foreignKey: 'directorId', as: 'movies-dir' })
Movies.belongsToMany(Genres, { through: 'movieGenres', foreignKey: 'movieId', as: 'genres' })
Genres.belongsToMany(Movies, { through: 'movieGenres', foreignKey: 'genreId', as: 'movies-gen' })
MovieDirectors.belongsTo(Movies, { foreignKey: 'movieId' })
MovieDirectors.belongsTo(Directors, { foreignKey: 'directorId' })
MovieGenres.belongsTo(Movies, { foreignKey: 'movieId' })
MovieGenres.belongsTo(Genres, { foreignKey: 'genreId' })

module.exports = {
    MovieDirectors,
    MovieGenres,
    Directors,
    Genres,
    Movies,
}
