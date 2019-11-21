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

Movies.belongsToMany(Directors, { through: movDirModel, foreignKey: 'movieId' })
Directors.belongsToMany(Movies, { through: movDirModel, foreignKey: 'directorId' })
Movies.belongsToMany(Genres, { through: movGenModel, foreignKey: 'movieId' })
Genres.belongsToMany(Movies, { through: movGenModel, foreignKey: 'genreId' })
MovieDirectors.belongsTo(Movies, { foreignKey: 'movieId', targetKey: 'movieId', as: 'Movies' })
MovieDirectors.belongsTo(Directors, { foreignKey: 'directorId', targetKey: 'directorId', as: 'Directors' })
MovieGenres.belongsTo(Movies, { foreignKey: 'movieId', targetKey: 'movieId', as: 'Movies' })
MovieGenres.belongsTo(Genres, { foreignKey: 'genreId', targetKey: 'genreId', as: 'Genres' })

module.exports = {
    MovieDirectors,
    MovieGenres,
    Directors,
    Genres,
    Movies,
}
