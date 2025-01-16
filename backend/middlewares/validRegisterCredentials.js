import Joi from "joi";

const validRegisterCredentials = (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required().alphanum(),
      password: Joi.string()
        .min(5)
        .max(30)
        .required(),
      email: Joi.string().email().required(),
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
