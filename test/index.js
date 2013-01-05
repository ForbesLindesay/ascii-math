var parse = require('../');

var buffer = '<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head><body>';
function add(formula) {
  buffer += '<div>';
  var parsed = parse(formula);
  buffer += parsed.toString();
  buffer += '</div>';
}
add('E=m c^2');
add('e^(i pi)=-1');
add('AA x in CC (sin^2x+cos^2x=1)');
add('sum_(i=1)^n i^3=((n(n+1))/2)^2');
add('[[a,b],[c,d]]((1,0),(0,1))');
add('6 < 9');
buffer += '</body></html>';

require('fs').writeFileSync(require('path').join(__dirname, 'server-generated.html'), buffer);