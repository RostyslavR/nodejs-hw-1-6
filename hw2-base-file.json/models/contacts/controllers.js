const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts/operations");
const { HttpError, resSuccess } = require("../../lib");

const getAll = async (req, res) => {
  const result = await listContacts();
  resSuccess(res, result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found`);
  }
  resSuccess(res, result);
};

const create = async (req, res) => {
  const result = await addContact(req.body);
  return res.status(201).json({
    status: "success",
    code: 201,
    data: { result },
  });
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found`);
  }
  resSuccess(res, result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id ${contactId} not found`);
  }
  resSuccess(res, result);
};

module.exports = { getAll, getById, create, removeById, updateById };
