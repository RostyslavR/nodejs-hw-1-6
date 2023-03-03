const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { HttpError } = require("../../lib");
const { User } = require("../../models/user");

const { SECRET_KEY } = require("../../config");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, verify: true });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw HttpError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "10h" });
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

module.exports = login;
