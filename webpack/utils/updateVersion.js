var path = require('path');
var versiony = require('versiony');
var package = path.join(__dirname, '..', '..', 'package.json');
var minor = process.env.MINOR || false;
var major = process.env.MAJOR || false;
console.log(major);

if (major) {
  versiony.from(package).major().to(package).end();
} else if (minor) {
  versiony.from(package).minor().to(package).end();
} else {
  versiony.from(package).patch().to(package).end();
}
