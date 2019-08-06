var path = require('path');
var fs = require('fs');
var package = path.join(__dirname, '..', '..', 'package.json');
var packageLock = path.join(__dirname, '..', '..', 'package-lock.json');

var dataPackage = JSON.parse(
  fs.readFileSync(
    package,
    'utf8',
    ),
);

var [
  zero,
  release,
  patch,
] = dataPackage.version.split('.').map(number => Number(number));

dataPackage.version = `${zero}.${release}.${patch + 1}`;

fs.writeFileSync(package, `${JSON.stringify(dataPackage, null, 4)}\n`);

var dataPackageLock = JSON.parse(
  fs.readFileSync(
    packageLock,
    'utf8',
    ),
);

var [
  zero,
  release,
  patch,
] = dataPackageLock.version.split('.').map(number => Number(number));

dataPackageLock.version = `${zero}.${release}.${patch + 1}`;

fs.writeFileSync(packageLock, `${JSON.stringify(dataPackageLock, null, 4)}\n`);