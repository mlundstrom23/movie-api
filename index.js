const express = require('express')
const models = require('./models')
const bodyParser = require('body-parser')
const http_port = 1337;
const Op = require('sequelize').Op
const reject = require('./reject').reject

const app = express()

app.use(bodyParser.json());

app.get('/movies', (request, response) => {
    models.Movie.findAll({
        attributes: ["id", "title", "releaseDate", "rating", "runTime"],
        include: [{
            attributes: ['id', 'name'],
            model: models.Director,
            through: { attributes: [] },
        }, {
            attributes: ['id', 'name'],
            model: models.Genre,
            through: { attributes: [] },
        }],
     }).then((movies) => {   // <---  if no async or await
        response.send(movies)
    })

})

app.get('/movies/:movieId', async (request, response) => {
    const { movieId } = request.params
    const match = await models.Movie.findAll({
        where: { id: movieId },
        attributes: ["id", "title", "releaseDate", "rating", "runTime"],
        include: [{
            attributes: ['id', 'name'],
            model: models.Director,
            through: { attributes: [] },
        }, {
            attributes: ['id', 'name'],
            model: models.Genre,
            through: { attributes: [] },
        }]
    })
    
    if (match) {
        response.send(match)
    } else {
        response.status(404).send('Please provide a valid ID to look up movie.')
    }
})

app.get('/directors/:directorId', async (request, response) => {
    const { directorId } = request.params
    const match = await models.Director.findAll({
        where: { id: directorId },
        attributes: ['id', 'name'],
        include: [{
            attributes: ["id", "title", "releaseDate", "rating", "runTime"],
            model: models.Movie,
            through: { attributes: [] },
            include: [ { model: models.Genre, 
                         attributes: ['id', 'name'], 
                         through: { attributes: [] } } ]
        }]
    })
    
    if (match) {
        response.send(match)
    } else {
        response.status(404).send('Please provide a valid ID to look up director.')
    }
})

app.get('/genres/:genreName', async (request, response) => {
    const { genreName } = request.params
    const match = await models.Genre.findAll({
        where: { name: genreName },
        attributes: ['id', 'name'],
        include: [{
            attributes: ["id", "title", "releaseDate", "rating", "runTime"],
            model: models.Movie,
            through: { attributes: [] },
            include: [ { model: models.Director, 
                         attributes: ['id', 'name'], 
                         through: { attributes: [] } } ]
        }]
    })
    
    if (match) {
        response.send(match)
    } else {
        response.status(404).send('Please provide a valid name to look up genre.')
    }
})

app.post('/movies', async (request, response) => {
    // Get request body, and isolate director and genre models from models.Movie
    const { directors, genres, ...restOfBody} = request.body

    // Iterate through each director name and get an ID from the database
    // Split director names with a comma if there is more than one in a post
    const directorNames = directors.split(', ')
    const directorsToAdd = await models.Director.findAll({
        attributes: ['id', 'director'],
        where: {
            [Op.or]: directorNames.map(name => {
                return { director: name }
            })
        },
        raw: true
    })

    // Iterate through each genre name and get an ID from the database
    // Split genre names with a comma if there is more than one in a post
    const genreNames = genres.split(', ')
    const genresToAdd = await models.Genre.findAll({
        attributes: ['id', 'genre'],
        where: {
            [Op.or]: genreNames.map(name => {
                return { genre: name }
            })
        },
        raw: true
    })

    /* If there is a difference between the directors listed in the request (directorsToAdd)
       and the directors from the database (directorNames):
         1. Loop through each director's name
         2. Confirm that they are not in the directorsToAdd
         3. Create records for new directors
    */
    if (directorsToAdd.length !== directorNames.length) {
        directorNames.forEach(async (director) => {
            /* Confirm that directorName does NOT exist in directorsToAdd:
                 1. Filter directorsToAdd by each directorName
                 2. If directorName is found in directorsToAdd, the filter 
                    will have a single array element in it
                    i. Check for a length of 1, and exit if true
            */
            if (directorsToAdd.filter(name =>
                name.director === director).length === 1) {
                    return;
            }

            const createdDirector = await models.Director.create({ director })
            // const createdDirector = { id: 23948, director }    <---- dummy data to check
            directorsToAdd.push(createdDirector)
        })
    }

    /* If there is a difference between the genres listed in the request (genresToAdd)
       and the genres from the database (genreNames):
         1. Loop through each genre's name
         2. Confirm that they are not in the genresToAdd
         3. Create records for new genres
    */
   if (genresToAdd.length !== genreNames.length) {
        genreNames.forEach(async (genre) => {
            /* Confirm that genreName does NOT exist in genresToAdd:
                1. Filter genresToAdd by each genreName
                2. If genreName is found in genresToAdd, the filter 
                    will have a single array element in it
                    i. Check for a length of 1, and exit if true
            */
            if (genresToAdd.filter(name =>
                name.genre === genre).length === 1) {
                    return;
            }

            const createdGenre = await models.Genre.create({ genre })
            // const createdGenre = { id: 32948, genre }    <---- dummy data to check
            genresToAdd.push(createdGenre)
        })
    }
    
    // Create new movie
    const newMovie = await models.Movie.create(restOfBody)

    // Add new JoinTables lookup table records for movies & genres
    await genresToAdd.forEach(async (genre) => {
        await models.JoinTables.create({ movieId: newMovie.id, genreId: genre.id })
    })

    // Add new JoinTables lookup table records for directors
    await directorsToAdd.forEach(async (director) => {
        await models.JoinTables.create({ directorId: director.id })
    })

    response.status(201).send({ newMovie, directors: directorsToAdd, genres: genresToAdd })
})

app.all('*', (request, response) => {
    response.send('Uh-oh, page not found.')
})

app.listen(http_port, () => {
    console.log('Server is up and running.')
})