const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let phoneNumbers = [ {id: 1, name: 'miika', number: 123123}, {id:2 , name: 'otso', number: '$$$44€€'}, {id:3, name: 'badger', number: '69696969699'} ]

app.get('/api/persons', (req, res) => {
    res.json(phoneNumbers)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info of ${phoneNumbers.length} people</p>
    <p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const personInQuestion = phoneNumbers.find(person => person.id === parseInt(id))
    if (!personInQuestion){
        res.status(404).end()
    }
    res.json(personInQuestion)
})

app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params
    const personInQuestion = phoneNumbers.find(person => person.id === parseInt(id))
    if (!personInQuestion){
        res.status(404).end()
    }
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const {name, number} = req.body
    
    if (!number && parseInt(number) !== 0) {
        res.status(409).json({error: 'Phone number must be included'})
    }
    if (!name) {
        res.status(409).json({error: 'Name must be included'})
    }
    if (phoneNumbers.find(person => person.name === name)){
        res.status(409).json({error: 'Name has to be unique'})
    }

    const id = Math.floor(Math.random()*1000000)
    const postedPerson = {id:id, name:name, number:number }

    phoneNumbers = phoneNumbers.concat(postedPerson)
    res.json(postedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})