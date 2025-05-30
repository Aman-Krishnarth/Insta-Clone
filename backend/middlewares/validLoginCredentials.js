import Joi from "joi";

const validLoginCredentials = (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(5).max(30).required(),
      email: Joi.string().email().required()
    });

    const {error, value} = schema.validate({
        password,
        email
    })

    if(error){
      console.log("error aaya hai")
        return res.json({
            success: false,
            message: error
        })
    }

    next()

  } catch (error) {
    console.log("Valid credentials catch");
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export default validLoginCredentials;
