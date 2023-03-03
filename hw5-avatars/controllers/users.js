const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const download = require("download");
const path = require("path");
const jimp = require("jimp");
const gravatar = require("gravatar");
const { HttpError } = require("../lib");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

const avatarsDir = path.join(__dirname, "..", "public", "avatars");

const getAll = async (req, res) => {
  const response = await User.find();
  return res.json(response);
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const gravatarURL = `http:${gravatar.url(email, { s: "250" })}`;
  await download(gravatarURL, avatarsDir);
  const avatarName = `${gravatarURL.split("/").reverse()[0].split("?")[0]}.jpg`;
  const avatarURL = path.join("/avatars", avatarName);

  const { subscription } = await User.create({
    email,
    password: hash,
    avatarURL,
  });

  return res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
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

const updateAvatar = async (req, res) => {
  try {
    const { path: tempUpload, filename } = req.file;
    const { _id } = req.user;
    const [extention] = filename.split(".").reverse();
    const avatarName = `${_id}.${extention}`;
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);

    const file = await jimp.read(resultUpload);
    await file.resize(250, 250).write(resultUpload);
    const avatarURL = path.join("/avatars", avatarName);
    const { avatarURL: avatarOldURL } = await User.findOneAndUpdate(
      { _id },
      { avatarURL }
    );
    if (avatarURL !== avatarOldURL) {
      await fs.unlink(
        path.join(avatarsDir, avatarOldURL.split("/").reverse()[0])
      );
    }

    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = {
  signup,
  login,
  getCurrent,
  loguot,
  remove,
  updateSubscription,
  updateAvatar,
  getAll,
};
