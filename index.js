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
    const personCount = persons.length
    const firstLine = `Phonebook has info for ${personCount} people`
    const date = new Date()
    const time = `${date}`

    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(firstLine +'\n\n'+ time)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
    })
    .catch(error => {
        console.log(error)
    })
})

const generateID = () => {
    return Math.floor(Math.random() * Math.floor(2000));
}

app.post('/api/persons/', (request,response) => {
    
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

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})  

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})