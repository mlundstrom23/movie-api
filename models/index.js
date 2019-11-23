const Sequelize = require('sequelize')
const allConfigs = require('../config/sequelize')
const MovieModel = require('./movies')
const DirectorModel = require('./directors')
const GenreModel = require('./genres')
// Join tables
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
// Join tables
const MovieDirectors = movDirModel(connection, Sequelize, Movie, Director)
const MovieGenres = movGenModel(connection, Sequelize, Movie, Genre) 

// Movies have many directors - n:m
Movie.belongsToMany(Director, {through: 'movieDirectors', foreignKey: 'movieId'})
// Directors have many movies - n:m
Director.belongsToMany(Movie, { through: 'movieDirectors', foreignKey: 'directorId'})
// Movies have many genres - n:m
Movie.belongsToMany(Genre, { through: 'movieGenres', foreignKey: 'movieId'})
// Genres have many movies - n:m
Genre.belongsToMany(Movie, { through: 'movieGenres', foreignKey: 'genreId'})
// Relation to join table
Movie.hasMany(MovieDirectors)
Director.hasMany(MovieDirectors)
// Join table relation to other tables
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
