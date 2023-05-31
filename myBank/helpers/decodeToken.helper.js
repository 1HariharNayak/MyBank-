const jwt = require("jsonwebtoken");
const { fetchUser } = require("../dbModel/cassandra.Model");

exports.validateJwtToken = (req, res, next) => {
  try {
    const decodeToken = (token) => {
      const decoded = jwt.decode(token, { complete: true });
      return decoded;
    };

    const token = req.headers.authorization;

    if (!token) {
      res.status(400).json({
        status: 1,
        message: `No token found`,
        result: {},
      });
    } else {
      const decoded = decodeToken(token);
      if (!decoded) {
        res.status(400).json({
          status: 1,
          message: "Invalid Token",
          result: {},
        });
      } else {
        const user_name = decoded.payload.sub;
        console.log("Username---", user_name);
        if (!user_name) {
          res.status(400).json({
            status: 1,
            message: "Invalid Token",
            result: {},
          });
        } else {
          req.user_name = user_name;
          next();
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    console.log(error.message);
    res.status(400).json({
      status: -1,
      message: `Something went wrong. Please try after sometime.`,
      result: {},
    });
  }
};

exports.userfetching = async (req, res, next) => {
  console.log("req.username-->", req.user_name);
  if (!req.user_name) {
    res.json({
      message: `User Not found`,
    });
  } else {
    try {
      const user_name = await fetchUser(req.user_name);
      if (user_name) {
        req.user_id = user_name[0].user_id.toString();
        console.log("===", req.user_id);
        next();
      } else {
        res.json({
          message: "User Denied",
        });
      }
    } catch (error) {
      res.json({
        message: "User denied",
      });
    }
  }
};


