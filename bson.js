var json = require('./json');

exports.toJsonString = function(doc) {
  var sJson = json.stringify(doc, null);
  sJson = sJson.replace(/ObjectID\(/g, '{ "$oid": ');
  sJson = sJson.replace(/\)/g, ' }');
  return sJson;
};
