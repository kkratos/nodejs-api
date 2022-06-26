// check username, password in post(login) request
// if exists create new jwt
// send back to frontend
// setup authentication so only the request with JWT can access the dashboard

const CustomAPIError = require("../errors/custom-error");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  const { username, password } = req.body;
  // mongoose
  // Joi
  // check in the controller

  if (!username || !password) {
    throw new CustomAPIError("Please provide username or password", 400);
  }

  const id = new Date().getDate();
  // try to keep payload small
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // console.log(username, password);
  res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, John Doe`,
    secret: `Here is your authorized data, you lucky number is ${luckyNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
