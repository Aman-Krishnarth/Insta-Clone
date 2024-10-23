import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);

    if (!decode) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }
    // console.log(decode);
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("isAuthenticated CATCH");
  }
};

export default isAuthenticated;
