const { NotFound } = require("http-errors");
const { User } = require("../../models");

const verificationToken = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verifyToken: verificationToken });
  if (!user) {
    throw new NotFound("User not found");
  }
  await User.findByIdAndUpdate(user._id, { verifyToken: null, verify: true });
  // res.send("<h2>Verification successful</h2>")
  return res.status(200).json({
    status: "OK",
    code: 200,
    ResponseBody: user,
  });
};

module.exports = verificationToken;
