require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req,res) => { 
    return(JSON.stringify(req.body))
})
app.use(morgan ( (tokens, req, res) => {
    if(req.method === 'POST'){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.body(req,res)
          ].join(' ')
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
})
)


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => { 
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    
    Person.countDocuments({}).then(count => {

    const firstLine = `Phonebook has info ${count} for people`
    const date = new Date()
    const time = `${date}`

    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(firstLine +'\n\n'+ time)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error) )
    
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
    })
    .catch(error => {
        next(error)
    })
})

const generateID = () => {
    return Math.floor(Math.random() * Math.floor(2000));
}

app.post('/api/persons/', (request,response,next) => {
    
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    const person = new Person({ 

        name: body.name,
        number: body.number,
        date: new Date(),

    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})  

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log(request.params.id)
    const person = {
        name : body.name,
        number : body.number,
    }
    
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => { 
    response.status(404).send({ error : 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if(error.name === 'MongoError'){
        return response.status(400).send({error: 'name must be unique'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})