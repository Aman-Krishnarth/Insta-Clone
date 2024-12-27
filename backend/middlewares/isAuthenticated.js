import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
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

    if (!decode) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("isAuthenticated CATCH");
    return res.json({
      success: false,
      message: "something went wrong"
    })
  }
};

export default isAuthenticated;
