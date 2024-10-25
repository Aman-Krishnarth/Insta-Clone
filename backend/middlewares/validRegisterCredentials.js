import Joi from "joi";

const validRegisterCredentials = (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required().alphanum(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(5)
        .max(30)
        .required(),
      email: Joi.string().email(),
    });

    const { error, value } = schema.validate({
      username,
      email,
      password,
    });

    if (error) {
      return res.json({
        success: false,
        message: error,
      });
    }

    next();
  } catch (error) {
    console.log("Valid register credentials catch block");
  }
};

export default validRegisterCredentials;
