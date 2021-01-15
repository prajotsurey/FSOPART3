const express = require('express')
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    let personCount = persons.length
    let firstLine = "Phonebook has info for " + personCount + " people"
    
    let date = new Date()
    let time = `${date}`
    console.log(date)
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(firstLine +'\n\n'+ time)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on prot ${PORT}`)
})