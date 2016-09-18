var fs = require('fs');
var path = require('path');
var package = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'));
var VERSION = package.version;

function getVersion() {
  return VERSION;
}

module.exports = VERSION;
