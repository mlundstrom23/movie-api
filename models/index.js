const Sequelize = require('sequelize')
const allConfigs = require('../config/sequelize')
const MovieModel = require('./movies')
const DirectorModel = require('./directors')
const GenreModel = require('./genres')
const movDirModel = require('./movieDirectors')
const movGenModel = require('./movieGenres')

const config = allConfigs['development']

const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
})


const Movie = MovieModel(connection, Sequelize)
const Director = DirectorModel(connection, Sequelize)
const Genre = GenreModel(connection, Sequelize)
const MovieDirectors = movDirModel(connection, Sequelize, Movie, Director)
const MovieGenres = movGenModel(connection, Sequelize, Movie, Genre) 

Movie.belongsToMany(Director, {through: 'movieDirectors', foreignKey: 'movieId'})
Director.belongsToMany(Movie, { through: 'movieDirectors', foreignKey: 'directorId'})
Movie.belongsToMany(Genre, { through: 'movieGenres', foreignKey: 'movieId'})
Genre.belongsToMany(Movie, { through: 'movieGenres', foreignKey: 'genreId'})
Movie.hasMany(MovieDirectors)
Director.hasMany(MovieDirectors)
MovieDirectors.belongsTo(Movie, { foreignKey: 'movieId' })
MovieDirectors.belongsTo(Director, { foreignKey: 'directorId' })
MovieGenres.belongsTo(Movie, { foreignKey: 'movieId' })
MovieGenres.belongsTo(Genre, { foreignKey: 'genreId' })

module.exports = {
    MovieDirectors,
    MovieGenres,
    Director,
    Genre,
    Movie,
}
