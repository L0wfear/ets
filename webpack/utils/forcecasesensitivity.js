var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function ForceCaseSensitivityPlugin() {
  this.plugin('normal-module-factory', function(nmf) {
    nmf.plugin('after-resolve', function(data, done) {
      var parentDir = path.dirname(data.resource);
      var resourceName = path.basename(data.resource);
      fs.readdir(parentDir, function(err, files) {
        if (err) {
          done(err);
        }
        if (files.indexOf(resourceName) === -1) {
          var realName = _.find(files, function(filename) {
            return filename.toLowerCase() === resourceName.toLowerCase()
          });
          done(new Error('ForceCaseSensitivityPlugin: `' + resourceName + '` does not match the corresponding file on disk `' + realName + '`'));
          return;
        }
        done(null, data);
      });
    });
  });
};
