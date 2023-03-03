const express = require("express");
const { tryToDo } = require("../lib");
const { validate, auth, upload } = require("../middlewares");
const { joiSchema } = require("../models/user");
const {
  signup,
  login,
  getCurrent,
  loguot,
  remove,
  updateSubscription,
  updateAvatar,
  getAll,
} = require("../controllers/users");

const router = express.Router();

router.get("/", tryToDo(getAll));

router.post("/signup", validate(joiSchema), tryToDo(signup));

router.post("/login", validate(joiSchema), tryToDo(login));

router.get("/current", auth, tryToDo(getCurrent));

router.get("/logout", auth, tryToDo(loguot));

router.patch("/subscription", auth, tryToDo(updateSubscription));

router.patch("/avatars", auth, upload.single("avatar"), tryToDo(updateAvatar));

router.delete("/delete", auth, tryToDo(remove));

module.exports = router;
