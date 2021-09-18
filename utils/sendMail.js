const { InternalServerError } = require("http-errors");
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  try {
    const email = { ...data, from: "Tania-Tatula@ex.ua" };
    await sgMail.send(email);
    return true;
  } catch (err) {
    throw new InternalServerError(err.message);
  }
};

module.exports = sendMail;
