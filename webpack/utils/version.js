var crypto = require('crypto');
var packageJson = require('../../package.json');

var version = packageJson.version;
var SALT = 'abdf2364a7d3528b';

function getVersionID() {
  try {
    var cipher = crypto.createCipher('aes-256-cbc', SALT);
    var crypted = cipher.update(version, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  } catch (err) {
    console.error('getVersionID error', err);
  }
  return null;
}

module.exports = {
  getVersionID: getVersionID,
  version: version
};
