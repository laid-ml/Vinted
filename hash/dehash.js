const fhash = require("./hash");

const dehash = (password, salt, hash) => {
  if (fhash(password, salt) === hash) {
    return true;
  }
  return false;
};

module.exports = dehash;
