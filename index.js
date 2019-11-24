const reject = require('./reject').reject
const express = require('express')
const models = require('./models')
const bodyParser = require('body-parser')
const http_port = 1337;
const Op = require('sequelize').Op

const app = express()

app.get('/movies', (request, response) => {
    models.Movie.findAll({
                attributes: ["id", "title", "directors.director", "releaseDate", "rating", "runTime"], 
                include: [{
                    attributes: [],
                    model: models.Director,
                    through: {attributes: []},
                }],
                raw: true,
            }).then((movies) => {
                //const filteredMovie = reject(movie, ["directors.movieDirectors.id"])
                //console.log(filteredMovie)
        const filteredMovies = movies.map(movie => {
            return reject(movie, ["directors.movieDirectors.id", 
                                  "directors.movieDirectors.movieId", 
                                  "directors.movieDirectors.directorId",
                                  "directors.movieDirectors.createdAt",
                                  "directors.movieDirectors.updatedAt"])
        })        
        response.send(filteredMovies)
    })
    
})

app.get('/movies/:filter', (request, response) => {
    const filter = request.params.filter
    const movie = movies.filter((movie) => {
        return movie.id == filter 
    })
    response.send(movie)
})

app.get('/directors/:filter', (request, response) => {

})

app.get('/genres/:filter', (request, response) => {
    let filter = request.params.filter
    let genre = movies.filter((movie) => {
        return movie.genres === filter
    })
    response.send(genre)
    console.log(genre)
})

app.all('*', (request, response) => {
    response.send('Uh-oh, page not found.')
})

app.listen(http_port, () => {
    console.log('Server is up and running.')
})