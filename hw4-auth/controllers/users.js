const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../lib");
const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const { subscription } = await User.create({ email, password: hash });

  return res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw HttpError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
  const { subscription } = await User.findOneAndUpdate(
    { _id: user._id },
    { token }
  );

  return res.json({
    token,
    user: {
      email,
      subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  return res.json({ email, subscription });
};

const loguot = async (req, res) => {
  const { _id } = req.user;
  await User.findOneAndUpdate({ _id }, { token: null });

  return res.status(204).json();
};

const remove = async (req, res) => {
  const { _id } = req.user;
  await User.findOneAndDelete({ _id });

  return res.status(204).json();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  const { email } = await User.findOneAndUpdate(
    { _id },
    { subscription },
    { new: true }
  );

  return res.json({
    user: {
      email,
      subscription,
    },
  });
};

module.exports = {
  signup,
  login,
  getCurrent,
  loguot,
  remove,
  updateSubscription,
};
