const { response, request } = require('express')
const express = require('express')
var morgan = require('morgan')
const app = express()

let persons = [
    {
        id:1,
        name: "John Doe",
        number:"123123123",
    },
    {
        id:2,
        name: "Jane Doe",
        number: "234234234",
    },
    {
        id:3,
        name: "James Doe",
        number: "345345345",
    },
    {
        id:4,
        name: "Jenna Doe",
        number: "456456456",
    }
]

app.use(express.json())


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
    response.json(persons)
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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    return Math.floor(Math.random() * Math.floor(2000));
}

app.post('/api/persons/', (request,response) => {
    
    const body = request.body
    console.lo
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = { 

        id: generateID(),
        name: body.name,
        number: body.number,
        date: new Date(),
        
    }

    persons = persons.concat(person)
    response.json(person)
})  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})