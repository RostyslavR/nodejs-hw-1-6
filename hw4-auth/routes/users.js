const express = require("express");
const { tryToDo } = require("../lib");
const { validate, auth } = require("../middlewares");
const { loginSchema, patchSchema } = require("../models/user");
const {
  signup,
  login,
  getCurrent,
  loguot,
  remove,
  updateSubscription,
} = require("../controllers/users");

const router = express.Router();

router.post("/signup", validate(loginSchema), tryToDo(signup));

router.post("/login", validate(loginSchema), tryToDo(login));

router.get("/current", auth, tryToDo(getCurrent));

router.get("/logout", auth, tryToDo(loguot));

router.patch("/", auth, validate(patchSchema), tryToDo(updateSubscription));

router.delete("/delete", auth, tryToDo(remove));

module.exports = router;
