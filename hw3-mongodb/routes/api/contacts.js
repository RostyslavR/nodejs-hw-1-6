const express = require("express");
const validateBody = require("../../middlewares/validateBody");
const { ctrlWrapper } = require("../../lib");
const {
  schemaCreate,
  schemaUpdate,
  schemaPatch,
} = require("../../models/contact");
const {
  getAll,
  getById,
  create,
  removeById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", ctrlWrapper(getAll));

router.get("/:contactId", ctrlWrapper(getById));

router.delete("/:contactId", ctrlWrapper(removeById));

router.post("/", validateBody(schemaCreate), ctrlWrapper(create));

router.put("/:contactId", validateBody(schemaUpdate), ctrlWrapper(updateById));

router.patch(
  "/:contactId/favorite",
  validateBody(schemaPatch),
  ctrlWrapper(updateFavorite)
);

module.exports = router;
