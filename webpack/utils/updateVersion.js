var path = require('path');
var fs = require('fs');
var package = path.join(__dirname, '..', '..', 'package.json');

var data = JSON.parse(
  fs.readFileSync(
    package,
    'utf8',
    ),
);

var [
  zero,
  release,
  patch,
] = data.version.split('.').map(number => Number(number));

data.version = `${zero}.${release}.${patch + 1}`;

fs.writeFileSync(package, `${JSON.stringify(data, null, 4)}\n`);
