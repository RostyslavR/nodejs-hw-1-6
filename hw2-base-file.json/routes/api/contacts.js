const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const { ctrlWrapper } = require("../../lib");
const { schemaPost, schemaPut } = require("../../models/contacts/schems");
const {
  getAll,
  getById,
  create,
  removeById,
  updateById,
} = require("../../models/contacts/controllers");

const router = express.Router();

router.get("/", ctrlWrapper(getAll));

router.get("/:contactId", ctrlWrapper(getById));

router.delete("/:contactId", ctrlWrapper(removeById));

router.post("/", validateBody(schemaPost), ctrlWrapper(create));

router.put("/:contactId", validateBody(schemaPut), ctrlWrapper(updateById));

module.exports = router;
