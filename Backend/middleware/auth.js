const jwt = require('jsonwebtoken')
const userModel = require('../models/User.model')

const getToken = req => {
  const JWT_KEY_NAME = process.env.JWT_KEY_NAME;
  const tokenFromCookie = req.cookies[JWT_KEY_NAME];
  console.log(tokenFromCookie);
  const tokenFromHeader = req.headers[JWT_KEY_NAME];
  console.log(tokenFromHeader);
  // const decodedToken = jwt.verify(tokenFromHeader, process.env.JWT_SECRET);
  // const emailFromToken = decodedToken.email;
  // console.log(emailFromToken)
  if (tokenFromHeader) return tokenFromHeader;
  if (tokenFromCookie) return tokenFromCookie;
}

const auth = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      res.status(401).send('unauthorized access');
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload) {
      res.status(401).send('unauthorized access');
      return;
    }

    const { email } = payload;
    const user = await userModel.findOne({ email }).exec();

    if (!user) {
      res.status(401).send('unauthorized access');
      return;
    }

    if (!req.loggedInUser) {
      Object.defineProperty(req, 'loggedInUser', {
        value: user,
        writable: false
      })
    } else {
      throw new Error('loggedInUser property already exist')
    }
    next();
  } catch (authError) {
    res.status(500).send(authError.message)
  }
}

const adminAuth = (req, res, next) => {
  console.log(req.loggedInUser)
  console.log(req.loggedInUser.isAdmin)
  if (req.loggedInUser.isAdmin === false) {
    res
      .status(401)
      .send(
        'unauthorized access, contact your system administrator if you need access to this resource'
      )
    return
  }
  next();
}

module.exports = { 
  auth,  
  adminAuth 
}