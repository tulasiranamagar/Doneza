const jwt = require("jsonwebtoken");

async function generateJWT(payload) {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return token;
}

async function verifyJWT(token) {
  try {
    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return data;
  } catch (error) {
    return false;
  }
}

async function decodeJWT(token) {
  try {
    const data = jwt.decode(token);

    return data;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT,
};