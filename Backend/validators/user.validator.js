const Joi = require('joi')

const validateCreateUser = user => { 
  const schema = Joi.object({
    email: Joi.string()
      .min(3)
      .max(40)
      .required(),
    password: Joi.string().min(4).max(128).required(),
    isAdmin: Joi.bool()
  })

  return schema.validate(user)
}

module.exports = {
  validateCreateUser
}