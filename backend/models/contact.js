const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URI
//mongodb.uri

mongoose.connect(url, 
{useNewUrlParser: true, useUnifiedTypology: true, useFindAndModify: false, useCreateIndex: true})
    .then(response => {
        console.log(response)
    })
    .catch((e) => {
        console.log('error connecting to MongoDB', e.message)
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})
contactSchema.plugin(uniqueValidator)

const Contact = mongoose.model('Contact', contactSchema)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


const getContacts = async () => {
    const response = await Contact.find({})
    console.log('phonebook')
    response.forEach(contact => {console.log(`${contact.name} ${contact.number}`)})

    return response
}

const getContact = async (id) => {
    return await Contact.findById(id)
}

const saveContact = async (contact) => {
    const newContact = new Contact ({name: contact.name, number: contact.number})
    const response = await newContact.save()
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    return response
}

const updateContact = async (id,name,number) => {
    const updateObject = {name: name, number: number}
    const response = await Contact.findByIdAndUpdate(id, updateObject, {new: true})
    return response
}

const deleteContact = async (id) => {
    const response = await Contact.findByIdAndDelete(id)
    return response
}

module.exports = { saveContact, getContacts, deleteContact, updateContact, getContact }