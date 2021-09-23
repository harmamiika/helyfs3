require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const contactModule = require('./models/contact')

app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(bodyParser.json())

app.get('/api/persons', (req, res, next) => {
    contactModule.getContacts()
        .then(contacts => { res.json(contacts) })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {

    contactModule.getContacts()
        .then(contacts => {
            res.send(`<p>Phonebook has info of ${contacts.length} people</p>
        <p>${new Date()}</p>`
            )
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const { name, number } = req.body

    if (!number && parseInt(number) !== 0) {
        res.status(409).json({ error: 'Phone number must be included' })
    }
    if (!name) {
        res.status(409).json({ error: 'Name must be included' })
    }


    const newContact = { name: name, number: number }
    contactModule.saveContact(newContact)
        .then(mongoresponse => { res.json(mongoresponse) })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    contactModule.getContact(id)
        .then(responseContact => {
            res.json(responseContact.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    contactModule.deleteContact(id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    const { name, number } = req.body

    contactModule.updateContact(id, name, number)
        .then(responseContact => {
            res.json(responseContact.toJSON())
        })
        .catch(error => next(error))
})


app.use((error, req, res, next) => {
    console.log(error)
    console.log('an error occured')
    next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})