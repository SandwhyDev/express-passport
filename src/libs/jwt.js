import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export const signJwt = (payload) => {
  return jwt.sign(payload, process.env.API_SECRET);
};

export const verifyJwt = async (req, res, next) => {
  try {
    let authHeader = await req.headers["authorization"];

    if (!authHeader) {
      res.status(400).json({
        success: false,
        msg: "authorization not found",
      });
      return;
    }

    let token = await authHeader.split(" ")[1];
    let cekToken = await jwt.verify(token, process.env.API_SECRET);

    if (!cekToken) {
      res.status(400).json({
        success: false,
        msg: "jwt mal format",
      });
      return;
    }

    // console.log(token);

    const decode_token = await jwt.decode(token);

    // console.log(decode_token.role);

    if (decode_token.role != "super admin") {
      res.status(400).json({
        success: false,
        message: "anda bukan super admin",
      });
      return;
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      msg: "jwt mal format",
    });
  }
};
