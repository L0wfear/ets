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
  kontur,
  zero,
  release,
  version,
] = data.version.split('.').map(number => Number(number));

data.version = `${kontur}.${zero}.${release}.${version + 1}`;

fs.writeFileSync(package, `${JSON.stringify(data, null, 4)}\n`);