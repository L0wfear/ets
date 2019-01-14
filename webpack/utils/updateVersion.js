var path = require('path');
var fs = require('fs');
var package = path.join(__dirname, '..', '..', 'package.json');
var packageLock = path.join(__dirname, '..', '..', 'package-lock.json');

var data = JSON.parse(
  fs.readFileSync(
    package,
    'utf8',
    ),
);

var dataLock = JSON.parse(
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
dataLock.version = `${kontur}.${zero}.${release}.${version + 1}`;

fs.writeFileSync(package, `${JSON.stringify(data, null, 4)}\n`);
fs.writeFileSync(packageLock, `${JSON.stringify(dataLock, null, 4)}\n`);
