const express = require('express')
const app = express()
app.use(express.json())

const generateId = () => {
  const maxId = persons.length > 0
    // creates a new array that contains all the ids of the notes.
    // Math.max returns the maximum value of the numbers that are passed to it.
    // However, notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max.
    // The array can be transformed into individual numbers by using the "three dot" spread syntax.
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


// read all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// read a person of specific id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  person
  ? res.json(person)
  : res.status(400).send(`No person with id #${id} was found`)
})

// read number of persons in the book
// date of the request
app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
  <br><br>
  ${new Date()}`)
})

// add a new entry
app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name) {
    // return is crucial,
    // otherwise the code will execute to the very end
    // and the malformed note would get saved to the application.
    return res.status(400).json({ 
      error: 'a name is required' 
    })
  } else if (!body.number) {
    return res.status(400).json({ 
      error: 'a number is required' 
    })
  } else if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

// delete a specific entry
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})