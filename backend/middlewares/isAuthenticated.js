import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  console.log("is authenticated");
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.json({
        success: false,
        message: "Invalid token",
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
    console.log(error)
    return res.json({
      success: false,
      message: "something went wrong"
    })
  }
};

export default isAuthenticated;
