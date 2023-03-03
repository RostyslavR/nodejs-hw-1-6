const { Contact } = require("../models/contact");

const { HttpError } = require("../lib");

const getAll = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const filter = { owner: req.user._id };
  if (favorite !== undefined) {
    favorite !== "" ? (filter.favorite = favorite) : (filter.favorite = true);
  }
  const result = await Contact.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "_id email");

  return res.json({
    status: "OK success",
    code: 200,
    data: { result },
  });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOne({
    _id: contactId,
    owner: req.user._id,
  });
  if (result) {
    return res.json({
      status: "OK success",
      code: 200,
      data: { result },
    });
  }
  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const create = async (req, res) => {
  const result = await Contact.create({ ...req.body, owner: req.user._id });

  return res.status(201).json({
    status: "Created success",
    code: 201,
    data: { result },
  });
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOneAndDelete({
    _id: contactId,
    owner: req.user._id,
  });

  if (result) {
    return res.json({
      status: "OK success",
      code: 200,
      data: { result },
    });
  }

  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: req.user._id,
    },
    req.body,
    { new: true }
  );

  if (result) {
    return res.json({
      status: "OK success",
      code: 200,
      data: { result },
    });
  }

  throw HttpError(404, `Contact with id ${contactId} not found`);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: req.user._id,
    },
    { favorite },
    { new: true }
  );

  if (result) {
    return res.json({
      status: "OK success",
      code: 200,
      data: { result },
    });
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
