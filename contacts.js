const {nanoid} = require('nanoid');//todo: nanoid generate only digital id



const fs = require('fs').promises;
const path = require('path');

const contactsPath = path.resolve('./db/contacts.json');

function listContacts() {
    let contactsList = {}
    fs.readFile(contactsPath, 'utf-8')
        .then(contacts => {
            JSON.parse(contacts).forEach(({id, name, email, phone}) => {
                contactsList[id] = {
                    name: name,
                    email: email,
                    phone: phone,
                }
            })
            return contactsList
        })
        .then(result => console.table(result))
        .catch(err => console.error)
}

function getContactById(contactId) {
    fs.readFile(contactsPath, 'utf-8')
        .then(contacts => JSON.parse(contacts))
        .then(result => result.find(contact => contact.id === contactId.toString()))
        .then(contact => {
                if (contact) {
                    console.log(`founded next contact by id ${contactId}:`);
                    console.table({
                            [contactId]: {
                                name: contact.name,
                                email: contact.email,
                                phone: contact.phone,
                            }
                        }
                    )
                    return true
                } else {
                    console.log(`not found contact by id = ${contactId}`);
                }
            }
        )
        .catch(err => {
            console.log(err)
        })
}

function removeContact(contactId) {
    fs.readFile(contactsPath, 'utf-8')
        .then(contacts => JSON.parse(contacts))
        .then(result => {
            const newContacts = result.filter(contact => contact.id !== contactId.toString())
            fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf-8')
            console.log(`contact =${contactId} was deleted`);
        })
        .catch(error => console.log(error));
}

function addContact(name, email, phone) {
    const id = nanoid(3).toString()
    const newContact = {
        id: id,
        name: name,
        email: email,
        phone: phone,
    }
    console.table(newContact);
    fs.readFile(contactsPath, 'utf-8')
        .then(contacts => JSON.parse(contacts))
        .then(oldContacts => {
            const newContacts = [...oldContacts, newContact];
            fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf-8')
        })
        .catch(error => console.error)
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};