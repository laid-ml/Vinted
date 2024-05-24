const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const hash = (password, salt) => {
  const hash = SHA256(password + salt).toString(encBase64);
  return hash;
};

module.exports = hash;
