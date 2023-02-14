const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readContacts(path) {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function writeContacts(contactsPath, data) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(data,null,2));
    return true;
  } catch (err) {
    console.log(err);
  }
}

async function listContacts() {
  return readContacts(contactsPath);
}

async function getContactById(contactId) {
  const data = await readContacts(contactsPath);
  const res = data.find((item) => item.id === contactId);
  if (!res) {
    return null;
  }
  return res;
}

async function removeContact(contactId) {
  const data = await readContacts(contactsPath);
  const idx = data.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const [remContact] = data.splice(idx, 1);
  const res = await writeContacts(contactsPath, data);
  if (!res) {
    return null;
  }
  return remContact;
}

async function addContact(id, name, email, phone) {
  const data = await readContacts(contactsPath);
  const item = { id, name, email, phone };
  if (item.id === "0") {
    item.id = uuidv4();
  }
  data.push(item);
  const res = await writeContacts(contactsPath, data);
  if (!res) {
    return null;
  }
  return item;
}

async function restoreContacts() {
  const data = await readContacts(
    path.join(__dirname, "db", "contactsBackUp.json")
  );
  const res = await writeContacts(contactsPath, data);
  if (!res) {
    return null;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  restoreContacts,
};
