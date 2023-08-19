const userModel = require('../models/User.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validateCreateUser } = require('../validators/user.validator')

const register = async (req, res) => {
  try {
    const { nickname, email, password, repeatPassword, isAdmin } = req.body

    if (!email || !password || !repeatPassword) {
      res.status(422).send('wrong email or password')
      return
    }

    if (password !== repeatPassword) {
      res.status(400).send('Passwords do not match');
      return;
    }

    const existingEmail = await userModel.find({ email })
    if (existingEmail.length) {
      res.status(400).send('You can not use this email')
      return
    }

    const existingNickName = await userModel.find({ nickname })
    if (existingNickName.length) {
      res.status(400).send('You can not use this NickName')
      return
    }

    const { error } = validateCreateUser({ email, password })
    if (error) {
      res.status(400).send('wrong email or password')
      return
    }

    passwordHash = await bcrypt.hash(password, 10); 

    await userModel.create({ nickname, email, password: passwordHash, isAdmin });

    res.redirect("http://127.0.0.1:5501/Frontend/index.html");
    // res.json({"url": "http://127.0.0.1:5501/Frontend/index.html"});
  } catch (userRegisterError) {
    res.status(500).send(userRegisterError.message)
  }
}

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log(email, password)

    if (!email || !password) {
      res.status(422).send('wrong email or password')
      return
    }

    const user = await userModel.findOne({ email }).exec()
    if (!user) {
      res.status(401).send('incorrect email or password')
      return
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).send('incorrect email or password')
      return
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY})

    const JWT_KEY = process.env.JWT_KEY_NAME;
    console.log(token)
    const COOKIE_NICK_NAME = process.env.COOKIE_NICK_NAME;

    res
    .header({ [JWT_KEY]: token })
      .cookie(JWT_KEY, token, { httpOnly: false })
      .cookie(COOKIE_NICK_NAME, user.nickname, { httpOnly: false })
      .json({jwt: token, nickname: user.nickname})
      // .redirect("http://127.0.0.1:5501/Frontend/index.html");
  } catch (userLoginError) {
    res.status(500).send(userLoginError.message)
  }
}

const logout = async (req, res) => {
  const JWT_KEY = process.env.JWT_KEY_NAME;
  const COOKIE_NICK_NAME = process.env.COOKIE_NICK_NAME;
  res
    .header({ [JWT_KEY]: '' })
      .cookie(JWT_KEY, '', { httpOnly: false })
      .cookie(COOKIE_NICK_NAME, '', { httpOnly: false })
      .json({})
  // res.cookie([JWT_KEY], '').redirect("http://127.0.0.1:5501/Frontend/index.html");
}

module.exports = {
  register,
  login,
  logout
}
 