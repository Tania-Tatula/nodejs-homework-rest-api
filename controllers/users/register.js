const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

const sendMail = require("../../utils/sendMail");
const { User } = require("../../models");
const { Conflict } = require("http-errors");
const avatarDir = path.join(__dirname, "../../", "public/avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const defaultAvatar = gravatar.url(email.toString(), { s: "250" }, true);
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }

  const verifyToken = v4();
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL: `${defaultAvatar}`,
    verifyToken: verifyToken,
  });

  const id = result._id.toString();
  const dirPath = path.join(avatarDir, id);
  await fs.mkdir(dirPath);

  const data = {
    to: email,
    subject: "Подтверждениея регистрации",
    html: `<a href ="http://localhost:3000/api/users/verify/${verifyToken}">Подтвердите регистрацию</a>`,
  };

  await sendMail(data);

  res.status(201).json({
    status: "succes",
    code: 201,
    users: result,
    html: `<a href="http://localhost:3000/api/users/verify/${verifyToken}">Подтвердите регистрацию</a>`,
  });
};
module.exports = register;



// альтернативний варіант реєстрації
// const bcrypt = require('bcryptjs')
// const sendMail = require('../../utils/sendMail');
// const fs = require("fs/promises");
// const path = require("path");
// const gravatar = require("gravatar");

// const { User } = require("../../models");
// const { Conflict } = require("http-errors");
// const avatarDir = path.join(__dirname, "../../", "public/avatars");

// const register = async (req, res, next) => {
//   const { email, password } = req.body;
//   const defaultAvatar = gravatar.url(email.toString(), { s: "250" }, true);
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Conflict("Email in use");
//   }
//   // const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//   // const result = await User.create({email, password:hashPassword })

//   const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//   const newUser = new User({ email,
//     avatarURL: `${defaultAvatar}`,
//    });
//   newUser.setPassword(hashPassword);
//   newUser.createVerifyToken();
//   await newUser.save();

//   const id = newUser._id.toString();
//   const dirPath = path.join(avatarDir, id);
//   await fs.mkdir(dirPath);

//   const { verifyToken } = newUser;

//     const data = {
//   to: email,
//   subject:'Подтверждениея регистрации',
//   html: `<a href ="http://localhost:3000/api/users/verify/${verifyToken}">Подтвердите регистрацию</a>`,
// }

// await sendMail(data);

//   res.status(201).json({
//     status: "succes",
//     code: 201,
//     users: newUser,
//      html: `<a href="http://localhost:3000/api/users/verify/${verifyToken}">Подтвердите регистрацию</a>`
//   });

//   res.status(201).json({
//     status: "succes",
//     code: 201,
//     users: {
//       email: email,
//       subscription: "starter",
//     },
//   });
// };
// module.exports = register;
