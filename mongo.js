const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://salamander:${password}@cluster0.in54a.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){ 
    Person.find({}).then(result => {
        console.log("phonebook")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5){
    person0 = new Person({
      name:process.argv[3],
      number:process.argv[4],
      date: new Date(),  
    })
    person0.save().then(result => { 
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
