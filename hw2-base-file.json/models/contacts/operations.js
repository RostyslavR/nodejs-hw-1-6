const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const updateContacts = async (data) => {
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return true;
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const result = data.find((item) => item.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const idx = data.findIndex((item) => item.id === contactId);
  if (idx < 0) {
    return null;
  }
  const result = data.splice(idx, 1);
  await updateContacts(data);
  return result;
};

const addContact = async (body) => {
  const data = await listContacts();
  const item = { id: uuidv4(), ...body };
  data.push(item);
  await updateContacts(data);
  return item;
};

const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const idx = data.findIndex((item) => item.id === contactId);
  if (idx < 0) {
    return null;
  }
  data[idx] = { ...data[idx], ...body };
  await updateContacts(data);
  return data[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
