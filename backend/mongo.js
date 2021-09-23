const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://harmamiika:${password}@phonebook.zc8xi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url, 
{useNewUrlParser: true, useUnifiedTypology: true, useFindAndModify: false, useCreateIndex: true})
    .then(response => {
        console.log(response)
    })


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const saveContact = async (contact) => {
    const response = await contact.save()
    console.log(response)
    mongoose.connection.close()
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
}

const getContacts = async (contact) => {
    const response = await Contact.find({})
    console.log('phonebook')
    response.forEach(contact => {console.log(`${contact.name} ${contact.number}`)})

    mongoose.connection.close()
}


if (process.argv[3] && process.argv[4]){
    const newContact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    saveContact(newContact)
}

if (process.argv.length === 3) {
    getContacts()
}