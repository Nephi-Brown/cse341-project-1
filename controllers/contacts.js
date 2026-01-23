const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    try { 
    //#swagger.tags = ['Contacts']
    const contacts = await mongodb
        .getDatabase()
        .db()
        .collection('contacts')
        .find()
        .toArray();
    res.status(200).json(contacts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    } 
  };

  const getSingle = async (req, res) => {
    //#swagger.tags = ['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid contact id to find a contact.');
    }
    const contactId = new ObjectId(req.params.id);
    try {
      const contact = await mongodb
        .getDatabase()
        .db()
        .collection('contacts')
        .findOne({ _id: contactId });
   
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(contact);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

//create contact
const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
   
    try {
      const response = await mongodb
        .getDatabase()
        .db()
        .collection('contacts')
        .insertOne(contact);
   
      if (response.acknowledged) {
        res.status(201).json({
          message: 'Contact created successfully',
          contactId: response.insertedId,
          contact: contact
        });
      } else {
        res.status(500).json({
          error: response.error || 'Some error occurred while creating the contact.'
        });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // update contact
const updateContact = async (req, res) => {
//#swagger.tags = ['Contacts']
if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid contact id to update a contact.');
}

const contactId = new ObjectId(req.params.id);
const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
};

try {
    const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .replaceOne({ _id: contactId }, contact);

    if (response.modifiedCount > 0) {
    res.status(200).json({ message: 'Contact updated successfully' });
    } else {
    res.status(404).json({ message: 'Contact not found or no changes applied' });
    }
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// delete contact

const deleteContact = async (req, res) => {
//#swagger.tags = ['Contacts']
if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid contact id to delete a contact.');
}

const contactId = new ObjectId(req.params.id);

try {
    const response = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
    res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
    res.status(404).json({ message: 'Contact not found' });
    }
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

/*const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday,
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('contacts')
        .insertOne(contact);
    if (response.acknowledged) {
        res.status(201).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
};

const updateContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to update a contact.');
    }
    const contactId = new ObjectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday,
    };
    const response = await mongodb
        .getD()
        .db()
        .collection('contacts')
        .replaceOne({_id: contactId}, contact);
    console.log(response);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a contact.');
    }
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('contacts')
        .deleteOne({ _id: contactId });
    console.log(response);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
};*/

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};