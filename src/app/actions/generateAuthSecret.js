const crypto = require('crypto');

const generateRandomHexString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const authSecret = generateRandomHexString(16); // 16 bytes = 32 characters

console.log(authSecret);
