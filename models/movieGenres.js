module.exports = (connection, Sequelize, Movie, Genre) => {
    return connection.define('movieGenres', {
        id: { type: Sequelize.INTEGER, 
              autoIncrement: true, 
              primaryKey: true,
        },
        movieId: { type: Sequelize.INTEGER, 
                   reference: { 
                     model: Movie, 
                     key: 'id' 
                   } 
        },
        genreId: { type: Sequelize.INTEGER, 
                   reference: { 
                     model: Genre, 
                     key: 'id' 
                   } 
        }
    })
}