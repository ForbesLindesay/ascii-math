var ml = require('./lib/math-ml');

var tokenTypes = require('./lib/token-types');
var CONST = tokenTypes.CONST;
var UNARY = tokenTypes.UNARY;
var BINARY = tokenTypes.BINARY;
var INFIX = tokenTypes.INFIX;
var LEFTBRACKET = tokenTypes.LEFTBRACKET;
var RIGHTBRACKET = tokenTypes.RIGHTBRACKET;
var SPACE = tokenTypes.SPACE;
var UNDEROVER = tokenTypes.UNDEROVER;
var DEFINITION = tokenTypes.DEFINITION;
var LEFTRIGHT = tokenTypes.LEFTRIGHT;
var TEXT = tokenTypes.TEXT;

var AMsymbols = require('./lib/symbols');
var AMnames = AMsymbols.map(function (symbol) {
  return symbol.input;
}); //list of input symbols

module.exports = parseMath;
function parseMath(str) {
  var frag, node;
  AMnestingDepth = 0;
  frag = AMparseExpr(str.replace(/^\s+/g, ""), false)[0];
  node = createMmlNode("math", frag);
  node.setAttribute("title", str.replace(/\s+/g, " "));
  return node;
}

var useFakes = true;

function createMmlNode(t, frag) {
  var node = useFakes ? new ml.Node(t) : document.createElementNS("http://www.w3.org/1998/Math/MathML", t);
  if (typeof frag === 'string') frag = useFakes ? new ml.Text(frag) : document.createTextNode(frag);
  if (frag) node.appendChild(frag);
  return node;
}

function createFragment() {
  return useFakes ? new ml.Node('fragment') : document.createDocumentFragment();
}

var AMquote = {
  input: "\"",
  tag: "mtext",
  output: "mbox",
  tex: null,
  ttype: TEXT
};



function AMremoveCharsAndBlanks(str, n) {
  //remove n characters and any following blanks
  var st;
  if (str.charAt(n) == "\\" && str.charAt(n + 1) != "\\" && str.charAt(n + 1) != " ") st = str.slice(n + 1);
  else st = str.slice(n);
  for (var i = 0; i < st.length && st.charCodeAt(i) <= 32; i = i + 1);
  return st.slice(i);
}

function position(arr, str, n) {
  // return position >=n where str appears or would be inserted
  // assumes arr is sorted
  if (n == 0) {
    var h, m;
    n = -1;
    h = arr.length;
    while (n + 1 < h) {
      m = (n + h) >> 1;
      if (arr[m] < str) n = m;
      else h = m;
    }
    return h;
  } else {
    for (var i = n; i < arr.length && arr[i] < str; i++);
    return i; // i=arr.length || arr[i]>=str
  }
}

function AMgetSymbol(str) {
  //return maximal initial substring of str that appears in names
  //return null if there is none
  var k = 0; //new pos
  var j = 0; //old pos
  var mk; //match pos
  var st;
  var tagst;
  var match = "";
  var more = true;
  for (var i = 1; i <= str.length && more; i++) {
    st = str.slice(0, i); //initial substring of length i
    j = k;
    k = position(AMnames, st, j);
    if (k < AMnames.length && str.slice(0, AMnames[k].length) == AMnames[k]) {
      match = AMnames[k];
      mk = k;
      i = match.length;
    }
    more = k < AMnames.length && str.slice(0, AMnames[k].length) >= AMnames[k];
  }
  AMpreviousSymbol = AMcurrentSymbol;
  if (match != "") {
    AMcurrentSymbol = AMsymbols[mk].ttype;
    return AMsymbols[mk];
  }
  // if str[0] is a digit or - return maxsubstring of digits.digits
  AMcurrentSymbol = CONST;
  k = 1;
  st = str.slice(0, 1);
  var integ = true;
  while ("0" <= st && st <= "9" && k <= str.length) {
    st = str.slice(k, k + 1);
    k++;
  }
  if (st == '.') {
    st = str.slice(k, k + 1);
    if ("0" <= st && st <= "9") {
      integ = false;
      k++;
      while ("0" <= st && st <= "9" && k <= str.length) {
        st = str.slice(k, k + 1);
        k++;
      }
    }
  }
  if ((integ && k > 1) || k > 2) {
    st = str.slice(0, k - 1);
    tagst = "mn";
  } else {
    k = 2;
    st = str.slice(0, 1); //take 1 character
    tagst = (("A" > st || st > "Z") && ("a" > st || st > "z") ? "mo" : "mi");
  }
  if (st == "-" && AMpreviousSymbol == INFIX) {
    AMcurrentSymbol = INFIX; //trick "/" into recognizing "-" on second parse
    return {
      input: st,
      tag: tagst,
      output: st,
      ttype: UNARY,
      func: true
    };
  }
  return {
    input: st,
    tag: tagst,
    output: st,
    ttype: CONST
  };
}

function AMremoveBrackets(node) {
  if (node.nodeName == "mrow") {
    var start = node.firstChild.firstChild.nodeValue;
    if (start == "(" || start == "[" || start == "{") node.removeChild(node.firstChild);
    var end = node.lastChild.firstChild.nodeValue;
    if (end == ")" || end == "]" || end == "}") node.removeChild(node.lastChild);
  }
}

/*Parsing ASCII math expressions with the following grammar
v ::= [A-Za-z] | greek letters | numbers | other constant symbols
u ::= sqrt | text | bb | other unary symbols for font commands
b ::= frac | root | stackrel         binary symbols
l ::= ( | [ | { | (: | {:            left brackets
r ::= ) | ] | } | :) | :}            right brackets
S ::= v | lEr | uS | bSS             Simple expression
I ::= S_S | S^S | S_S^S | S          Intermediate expression
E ::= IE | I/I                       Expression
Each terminal symbol is translated into a corresponding mathml node.*/

var AMnestingDepth, AMpreviousSymbol, AMcurrentSymbol;

function AMparseSexpr(str) { //parses str and returns [node,tailstr]
  var symbol, node, result, i, st; // rightvert = false,
  str = AMremoveCharsAndBlanks(str, 0);
  symbol = AMgetSymbol(str); //either a token or a bracket or empty
  if (symbol == null || symbol.ttype == RIGHTBRACKET && AMnestingDepth > 0) {
    return [null, str];
  }
  if (symbol.ttype == DEFINITION) {
    str = symbol.output + AMremoveCharsAndBlanks(str, symbol.input.length);
    symbol = AMgetSymbol(str);
  }
  switch (symbol.ttype) {
    case UNDEROVER:
    case CONST:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      //its a constant
      return [createMmlNode(symbol.tag, symbol.output), str];
    case LEFTBRACKET:
      //read (expr+)
      AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseExpr(str, true);
      AMnestingDepth--;
      if (typeof symbol.invisible == "boolean" && symbol.invisible) node = createMmlNode("mrow", result[0]);
      else {
        node = createMmlNode("mo", symbol.output);
        node = createMmlNode("mrow", node);
        node.appendChild(result[0]);
      }
      return [node, result[1]];
    case TEXT:
      var mRow = createMmlNode("mrow");
      if (symbol != AMquote) str = AMremoveCharsAndBlanks(str, symbol.input.length);
      if (str.charAt(0) == "{") i = str.indexOf("}");
      else if (str.charAt(0) == "(") i = str.indexOf(")");
      else if (str.charAt(0) == "[") i = str.indexOf("]");
      else if (symbol == AMquote) i = str.slice(1).indexOf("\"") + 1;
      else i = 0;
      if (i == -1) i = str.length;
      st = str.slice(1, i);
      if (st.charAt(0) == " ") {
        node = createMmlNode("mspace");
        node.setAttribute("width", "1ex");
        mRow.appendChild(node);
      }
      mRow.appendChild(
      createMmlNode(symbol.tag, st));
      if (st.charAt(st.length - 1) == " ") {
        node = createMmlNode("mspace");
        node.setAttribute("width", "1ex");
        mRow.appendChild(node);
      }
      str = AMremoveCharsAndBlanks(str, i + 1);
      return [mRow, str];
    case UNARY:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseSexpr(str);
      if (result[0] == null) return [createMmlNode(symbol.tag, symbol.output), str];
      if (typeof symbol.func == "boolean" && symbol.func) { // functions hack
        st = str.charAt(0);
        if (st == "^" || st == "_" || st == "/" || st == "|" || st == ",") {
          return [createMmlNode(symbol.tag, symbol.output), str];
        } else {
          node = createMmlNode("mrow", createMmlNode(symbol.tag, symbol.output));
          node.appendChild(result[0]);
          return [node, result[1]];
        }
      }
      AMremoveBrackets(result[0]);
      if (symbol.input == "sqrt") { // sqrt
        return [createMmlNode(symbol.tag, result[0]), result[1]];
      } else if (typeof symbol.acc == "boolean" && symbol.acc) { // accent
        node = createMmlNode(symbol.tag, result[0]);
        node.appendChild(createMmlNode("mo", symbol.output));
        return [node, result[1]];
      } else { // font change command
        if (typeof symbol.codes != "undefined") {
          for (i = 0; i < result[0].childNodes.length; i++)
          if (result[0].childNodes[i].nodeName == "mi" || result[0].nodeName == "mi") {
            st = (result[0].nodeName == "mi" ? result[0].firstChild.nodeValue : result[0].childNodes[i].firstChild.nodeValue);
            var newst = [];
            for (var j = 0; j < st.length; j++)
            if (st.charCodeAt(j) > 64 && st.charCodeAt(j) < 91) newst = newst + String.fromCharCode(symbol.codes[st.charCodeAt(j) - 65]);
            else newst = newst + st.charAt(j);
            if (result[0].nodeName == "mi") result[0] = createMmlNode("mo", newst);
            else result[0].replaceChild(createMmlNode("mo", newst), result[0].childNodes[i]);
          }
        }
        node = createMmlNode(symbol.tag, result[0]);
        node.setAttribute(symbol.atname, symbol.atval);
        return [node, result[1]];
      }
    case BINARY:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseSexpr(str);
      if (result[0] == null) return [createMmlNode("mo", symbol.input), str];
      AMremoveBrackets(result[0]);
      var result2 = AMparseSexpr(result[1]);
      if (result2[0] == null) return [createMmlNode("mo", symbol.input), str];
      AMremoveBrackets(result2[0]);

      var binaryTag = createMmlNode(symbol.tag);
      if (symbol.input == "root" || symbol.input == "stackrel") binaryTag.appendChild(result2[0]);
      binaryTag.appendChild(result[0]);
      if (symbol.input == "frac") binaryTag.appendChild(result2[0]);
      return [binaryTag, result2[1]];
    case INFIX:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      return [createMmlNode("mo", symbol.output), str];
    case SPACE:
      var mRow = createMmlNode("mrow");
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      node = createMmlNode("mspace");
      node.setAttribute("width", "1ex");
      mRow.appendChild(node);
      mRow.appendChild(createMmlNode(symbol.tag, symbol.output));
      node = createMmlNode("mspace");
      node.setAttribute("width", "1ex");
      mRow.appendChild(node);
      return [mRow, str];
    case LEFTRIGHT:
      AMnestingDepth++;
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseExpr(str, false);
      AMnestingDepth--;
      var st = "";
      if (result[0].lastChild != null) st = result[0].lastChild.firstChild.nodeValue;
      if (st == "|") { // its an absolute value subterm
        node = createMmlNode("mo", symbol.output);
        node = createMmlNode("mrow", node);
        node.appendChild(result[0]);
        return [node, result[1]];
      } else { // the "|" is a \mid so use unicode 2223 (divides) for spacing
        node = createMmlNode("mo", "\u2223");
        node = createMmlNode("mrow", node);
        return [node, str];
      }
    default:
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      //symbol.tag is a constant
      return [createMmlNode(symbol.tag, symbol.output), str];
  }
}

function AMparseIexpr(str) {
  var symbol, sym1, sym2, node, result, underover;
  str = AMremoveCharsAndBlanks(str, 0);
  sym1 = AMgetSymbol(str);
  result = AMparseSexpr(str);
  node = result[0];
  str = result[1];
  symbol = AMgetSymbol(str);
  if (symbol.ttype == INFIX && symbol.input != "/") {
    str = AMremoveCharsAndBlanks(str, symbol.input.length);
    result = AMparseSexpr(str);
    if (result[0] == null) // show box in place of missing argument
    result[0] = createMmlNode("mo", "\u25A1");
    else AMremoveBrackets(result[0]);
    str = result[1];
    if (symbol.input == "_") {
      sym2 = AMgetSymbol(str);
      underover = (sym1.ttype == UNDEROVER);
      if (sym2.input == "^") {
        str = AMremoveCharsAndBlanks(str, sym2.input.length);
        var res2 = AMparseSexpr(str);
        AMremoveBrackets(res2[0]);
        str = res2[1];
        node = createMmlNode((underover ? "munderover" : "msubsup"), node);
        node.appendChild(result[0]);
        node.appendChild(res2[0]);
        node = createMmlNode("mrow", node); // so sum does not stretch
      } else {
        node = createMmlNode((underover ? "munder" : "msub"), node);
        node.appendChild(result[0]);
      }
    } else {
      node = createMmlNode(symbol.tag, node);
      node.appendChild(result[0]);
    }
  }
  return [node, str];
}

function AMparseExpr(str, rightbracket) {
  var symbol, node, result, i,
  newFrag = createFragment();
  do {
    str = AMremoveCharsAndBlanks(str, 0);
    result = AMparseIexpr(str);
    node = result[0];
    str = result[1];
    symbol = AMgetSymbol(str);
    if (symbol.ttype == INFIX && symbol.input == "/") {
      str = AMremoveCharsAndBlanks(str, symbol.input.length);
      result = AMparseIexpr(str);
      if (result[0] == null) // show box in place of missing argument
      result[0] = createMmlNode("mo", "\u25A1");
      else AMremoveBrackets(result[0]);
      str = result[1];
      AMremoveBrackets(node);
      node = createMmlNode(symbol.tag, node);
      node.appendChild(result[0]);
      newFrag.appendChild(node);
      symbol = AMgetSymbol(str);
    } else if (node != undefined) newFrag.appendChild(node);
  } while ((symbol.ttype != RIGHTBRACKET && (symbol.ttype != LEFTRIGHT || rightbracket) || AMnestingDepth == 0) && symbol != null && symbol.output != "");
  if (symbol.ttype == RIGHTBRACKET || symbol.ttype == LEFTRIGHT) {
    var len = newFrag.childNodes.length;
    if (len > 0 && newFrag.childNodes[len - 1].nodeName == "mrow" && len > 1 && newFrag.childNodes[len - 2].nodeName == "mo" && newFrag.childNodes[len - 2].firstChild.nodeValue == ",") { //matrix
      var right = newFrag.childNodes[len - 1].lastChild.firstChild.nodeValue;
      if (right == ")" || right == "]") {
        var left = newFrag.childNodes[len - 1].firstChild.firstChild.nodeValue;
        if (left == "(" && right == ")" && symbol.output != "}" || left == "[" && right == "]") {
          var pos = []; // positions of commas
          var matrix = true;
          var m = newFrag.childNodes.length;
          for (i = 0; matrix && i < m; i = i + 2) {
            pos[i] = [];
            node = newFrag.childNodes[i];
            if (matrix) matrix = node.nodeName == "mrow" && (i == m - 1 || node.nextSibling.nodeName == "mo" && node.nextSibling.firstChild.nodeValue == ",") && node.firstChild.firstChild.nodeValue == left && node.lastChild.firstChild.nodeValue == right;
            if (matrix) {
              for (var j = 0; j < node.childNodes.length; j++) {
                if (node.childNodes[j].firstChild.nodeValue == ",") pos[i][pos[i].length] = j;
              }
            }
            if (matrix && i > 1) matrix = pos[i].length == pos[i - 2].length;
          }
          if (matrix) {
            var n, k, table = createMmlNode("mtable");
            for (i = 0; i < m; i = i + 2) {
              var row = createMmlNode("mtr");
              var tableCell = createMmlNode("mtd");
              node = newFrag.firstChild; // <mrow>(-,-,...,-,-)</mrow>
              n = node.childNodes.length;
              k = 0;
              node.removeChild(node.firstChild); //remove (
              for (j = 1; j < n - 1; j++) {
                if (typeof pos[i][k] != "undefined" && j == pos[i][k]) {
                  node.removeChild(node.firstChild); //remove ,
                  row.appendChild(tableCell);
                  tableCell = createMmlNode('mtd');
                  k++;
                } else tableCell.appendChild(node.firstChild);
              }
              row.appendChild(tableCell)
              if (newFrag.childNodes.length > 2) {
                newFrag.removeChild(newFrag.firstChild); //remove <mrow>)</mrow>
                newFrag.removeChild(newFrag.firstChild); //remove <mo>,</mo>
              }
              table.appendChild(row);
            }
            node = table;
            if (typeof symbol.invisible == "boolean" && symbol.invisible) node.setAttribute("columnalign", "left");
            newFrag.replaceChild(node, newFrag.firstChild);
          }
        }
      }
    }
    str = AMremoveCharsAndBlanks(str, symbol.input.length);
    if (typeof symbol.invisible != "boolean" || !symbol.invisible) {
      node = createMmlNode("mo", symbol.output);
      newFrag.appendChild(node);
    }
  }
  return [newFrag, str];
}