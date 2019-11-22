module.exports = (connection, Sequelize, Movies, Directors) => {
    return connection.define('movieDirectors', {
        id: { type: Sequelize.INTEGER, 
              autoIncrement: true, 
              primaryKey: true,
        },
        movieId: { type: Sequelize.INTEGER, 
                   reference: { 
                     model: Movies, 
                     key: 'id' 
                   } 
        },
        directorId: { type: Sequelize.INTEGER, 
                      reference: { 
                        model: Directors, 
                        key: 'id' 
                      } 
        }
    })
}