const express = require('express')
const movies = require('./movies.json')
const bodyParser = require('body-parser')
const http_port = 1337;
const app = express()

app.get('/movies', (request, response) => {
    response.send(movies)
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