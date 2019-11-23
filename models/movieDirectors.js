module.exports = (connection, Sequelize, Movie, Director) => {
    return connection.define('movieDirectors', {
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
        directorId: { type: Sequelize.INTEGER, 
                      reference: { 
                        model: Director, 
                        key: 'id' 
                      } 
        }
    })
}