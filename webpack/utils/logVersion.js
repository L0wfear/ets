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
console.log('\x1b[36m%s\x1b[0m', `-`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `--`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `---`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `   | Версия ${data.version}`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `---`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `--`);  //cyan
console.log('\x1b[36m%s\x1b[0m', `-`);  //cyan
