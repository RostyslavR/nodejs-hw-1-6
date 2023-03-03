const { Contact } = require("../models/contact");

const { HttpError, HttpSuccess } = require("../lib");

const getAll = async (req, res) => {
  const result = await Contact.find({});
  return res.json(HttpSuccess(result));
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (result) {
    return res.json(HttpSuccess(result));
  }
  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const create = async (req, res) => {
  const result = await Contact.create(req.body);
  return res.status(201).json(HttpSuccess(result, 201));
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (result) {
    return res.json(HttpSuccess(result));
  }
  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (result) {
    return res.json(HttpSuccess(result));
  }
  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  if (result) {
    return res.json(HttpSuccess(result));
  }
  throw HttpError(404, `Contact with id ${contactId} not found`);
};

module.exports = {
  getAll,
  getById,
  create,
  removeById,
  updateById,
  updateFavorite,
};
