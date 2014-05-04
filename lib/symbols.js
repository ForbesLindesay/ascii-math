var tokenTypes = require('./token-types');
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

// character lists for Mozilla/Netscape fonts
var AMcal = [0xEF35, 0x212C, 0xEF36, 0xEF37, 0x2130, 0x2131, 0xEF38, 0x210B, 0x2110, 0xEF39, 0xEF3A, 0x2112, 0x2133, 0xEF3B, 0xEF3C, 0xEF3D, 0xEF3E, 0x211B, 0xEF3F, 0xEF40, 0xEF41, 0xEF42, 0xEF43, 0xEF44, 0xEF45, 0xEF46];
var AMfrk = [0xEF5D, 0xEF5E, 0x212D, 0xEF5F, 0xEF60, 0xEF61, 0xEF62, 0x210C, 0x2111, 0xEF63, 0xEF64, 0xEF65, 0xEF66, 0xEF67, 0xEF68, 0xEF69, 0xEF6A, 0x211C, 0xEF6B, 0xEF6C, 0xEF6D, 0xEF6E, 0xEF6F, 0xEF70, 0xEF71, 0x2128];
var AMbbb = [0xEF8C, 0xEF8D, 0x2102, 0xEF8E, 0xEF8F, 0xEF90, 0xEF91, 0x210D, 0xEF92, 0xEF93, 0xEF94, 0xEF95, 0xEF96, 0x2115, 0xEF97, 0x2119, 0x211A, 0x211D, 0xEF98, 0xEF99, 0xEF9A, 0xEF9B, 0xEF9C, 0xEF9D, 0xEF9E, 0x2124];


var symbols = [
  //some greek symbols

  {input: "alpha", tag: "mi", output: "\u03B1", tex: null, ttype: CONST}, 
  {input: "beta", tag: "mi", output: "\u03B2", tex: null, ttype: CONST}, 
  {input: "chi", tag: "mi", output: "\u03C7", tex: null, ttype: CONST}, 
  {input: "delta", tag: "mi", output: "\u03B4", tex: null, ttype: CONST}, 
  {input: "Delta", tag: "mo", output: "\u0394", tex: null, ttype: CONST}, 
  {input: "epsi", tag: "mi", output: "\u03B5", tex: "epsilon", ttype: CONST}, 
  {input: "varepsilon", tag: "mi", output: "\u025B", tex: null, ttype: CONST}, 
  {input: "eta", tag: "mi", output: "\u03B7", tex: null, ttype: CONST}, 
  {input: "gamma", tag: "mi", output: "\u03B3", tex: null, ttype: CONST}, 
  {input: "Gamma", tag: "mo", output: "\u0393", tex: null, ttype: CONST}, 
  {input: "iota", tag: "mi", output: "\u03B9", tex: null, ttype: CONST}, 
  {input: "kappa", tag: "mi", output: "\u03BA", tex: null, ttype: CONST}, 
  {input: "lambda", tag: "mi", output: "\u03BB", tex: null, ttype: CONST}, 
  {input: "Lambda", tag: "mo", output: "\u039B", tex: null, ttype: CONST}, 
  {input: "mu", tag: "mi", output: "\u03BC", tex: null, ttype: CONST}, 
  {input: "nu", tag: "mi", output: "\u03BD", tex: null, ttype: CONST}, 
  {input: "omega", tag: "mi", output: "\u03C9", tex: null, ttype: CONST}, 
  {input: "Omega", tag: "mo", output: "\u03A9", tex: null, ttype: CONST}, 
  {input: "phi", tag: "mi", output: "\u03C6", tex: null, ttype: CONST}, 
  {input: "varphi", tag: "mi", output: "\u03D5", tex: null, ttype: CONST}, 
  {input: "Phi", tag: "mo", output: "\u03A6", tex: null, ttype: CONST}, 
  {input: "pi", tag: "mi", output: "\u03C0", tex: null, ttype: CONST}, 
  {input: "Pi", tag: "mo", output: "\u03A0", tex: null, ttype: CONST}, 
  {input: "psi", tag: "mi", output: "\u03C8", tex: null, ttype: CONST}, 
  {input: "Psi", tag: "mi", output: "\u03A8", tex: null, ttype: CONST}, 
  {input: "rho", tag: "mi", output: "\u03C1", tex: null, ttype: CONST}, 
  {input: "sigma", tag: "mi", output: "\u03C3", tex: null, ttype: CONST}, 
  {input: "Sigma", tag: "mo", output: "\u03A3", tex: null, ttype: CONST}, 
  {input: "tau", tag: "mi", output: "\u03C4", tex: null, ttype: CONST}, 
  {input: "theta", tag: "mi", output: "\u03B8", tex: null, ttype: CONST}, 
  {input: "vartheta", tag: "mi", output: "\u03D1", tex: null, ttype: CONST}, 
  {input: "Theta", tag: "mo", output: "\u0398", tex: null, ttype: CONST}, 
  {input: "upsilon", tag: "mi", output: "\u03C5", tex: null, ttype: CONST}, 
  {input: "xi", tag: "mi", output: "\u03BE", tex: null, ttype: CONST}, 
  {input: "Xi", tag: "mo", output: "\u039E", tex: null, ttype: CONST}, 
  {input: "zeta", tag: "mi", output: "\u03B6", tex: null, ttype: CONST},

  //binary operation symbols
  //{input:"-",  tag:"mo", output:"\u0096", tex:null, ttype:CONST},

  {input: "*", tag: "mo", output: "\u22C5", tex: "cdot", ttype: CONST}, 
  {input: "**", tag: "mo", output: "\u22C6", tex: "star", ttype: CONST}, 
  {input: "//", tag: "mo", output: "/", tex: null, ttype: CONST}, 
  {input: "\\\\", tag: "mo", output: "\\", tex: "backslash", ttype: CONST}, 
  {input: "setminus", tag: "mo", output: "\\", tex: null, ttype: CONST}, 
  {input: "xx", tag: "mo", output: "\u00D7", tex: "times", ttype: CONST}, 
  {input: "-:", tag: "mo", output: "\u00F7", tex: "divide", ttype: CONST}, 
  {input: "@", tag: "mo", output: "\u26AC", tex: "circ", ttype: CONST}, 
  {input: "o+", tag: "mo", output: "\u2295", tex: "oplus", ttype: CONST}, 
  {input: "ox", tag: "mo", output: "\u2297", tex: "otimes", ttype: CONST}, 
  {input: "o.", tag: "mo", output: "\u2299", tex: "odot", ttype: CONST}, 
  {input: "sum", tag: "mo", output: "\u2211", tex: null, ttype: UNDEROVER}, 
  {input: "prod", tag: "mo", output: "\u220F", tex: null, ttype: UNDEROVER}, 
  {input: "^^", tag: "mo", output: "\u2227", tex: "wedge", ttype: CONST}, 
  {input: "^^^", tag: "mo", output: "\u22C0", tex: "bigwedge", ttype: UNDEROVER}, 
  {input: "vv", tag: "mo", output: "\u2228", tex: "vee", ttype: CONST}, 
  {input: "vvv", tag: "mo", output: "\u22C1", tex: "bigvee", ttype: UNDEROVER}, 
  {input: "nn", tag: "mo", output: "\u2229", tex: "cap", ttype: CONST}, 
  {input: "nnn", tag: "mo", output: "\u22C2", tex: "bigcap", ttype: UNDEROVER}, 
  {input: "uu", tag: "mo", output: "\u222A", tex: "cup", ttype: CONST}, 
  {input: "uuu", tag: "mo", output: "\u22C3", tex: "bigcup", ttype: UNDEROVER},

  //binary relation symbols

  {input: "!=", tag: "mo", output: "\u2260", tex: "ne", ttype: CONST}, 
  {input: ":=", tag: "mo", output: ":=", tex: null, ttype: CONST}, 
  {input: "lt", tag: "mo", output: "<", tex: null, ttype: CONST}, 
  {input: "<=", tag: "mo", output: "\u2264", tex: "le", ttype: CONST}, 
  {input: "lt=", tag: "mo", output: "\u2264", tex: "leq", ttype: CONST}, 
  {input: ">=", tag: "mo", output: "\u2265", tex: "ge", ttype: CONST}, 
  {input: "geq", tag: "mo", output: "\u2265", tex: null, ttype: CONST}, 
  {input: "-<", tag: "mo", output: "\u227A", tex: "prec", ttype: CONST}, 
  {input: "-lt", tag: "mo", output: "\u227A", tex: null, ttype: CONST}, 
  {input: ">-", tag: "mo", output: "\u227B", tex: "succ", ttype: CONST}, 
  {input: "-<=", tag: "mo", output: "\u2AAF", tex: "preceq", ttype: CONST}, 
  {input: ">-=", tag: "mo", output: "\u2AB0", tex: "succeq", ttype: CONST}, 
  {input: "in", tag: "mo", output: "\u2208", tex: null, ttype: CONST}, 
  {input: "!in", tag: "mo", output: "\u2209", tex: "notin", ttype: CONST}, 
  {input: "sub", tag: "mo", output: "\u2282", tex: "subset", ttype: CONST}, 
  {input: "sup", tag: "mo", output: "\u2283", tex: "supset", ttype: CONST}, 
  {input: "sube", tag: "mo", output: "\u2286", tex: "subseteq", ttype: CONST}, 
  {input: "supe", tag: "mo", output: "\u2287", tex: "supseteq", ttype: CONST}, 
  {input: "-=", tag: "mo", output: "\u2261", tex: "equiv", ttype: CONST}, 
  {input: "~=", tag: "mo", output: "\u2245", tex: "cong", ttype: CONST}, 
  {input: "~~", tag: "mo", output: "\u2248", tex: "approx", ttype: CONST}, 
  {input: "prop", tag: "mo", output: "\u221D", tex: "propto", ttype: CONST},

  //logical symbols

  {input: "and", tag: "mtext", output: "and", tex: null, ttype: SPACE}, 
  {input: "or", tag: "mtext", output: "or", tex: null, ttype: SPACE}, 
  {input: "not", tag: "mo", output: "\u00AC", tex: "neg", ttype: CONST}, 
  {input: "=>", tag: "mo", output: "\u21D2", tex: "implies", ttype: CONST}, 
  {input: "if", tag: "mo", output: "if", tex: null, ttype: SPACE}, 
  {input: "<=>", tag: "mo", output: "\u21D4", tex: "iff", ttype: CONST}, 
  {input: "AA", tag: "mo", output: "\u2200", tex: "forall", ttype: CONST}, 
  {input: "EE", tag: "mo", output: "\u2203", tex: "exists", ttype: CONST}, 
  {input: "_|_", tag: "mo", output: "\u22A5", tex: "bot", ttype: CONST}, 
  {input: "TT", tag: "mo", output: "\u22A4", tex: "top", ttype: CONST}, 
  {input: "|--", tag: "mo", output: "\u22A2", tex: "vdash", ttype: CONST}, 
  {input: "|==", tag: "mo", output: "\u22A8", tex: "models", ttype: CONST},

  //grouping brackets

  {input: "(", tag: "mo", output: "(", tex: null, ttype: LEFTBRACKET}, 
  {input: ")", tag: "mo", output: ")", tex: null, ttype: RIGHTBRACKET}, 
  {input: "[", tag: "mo", output: "[", tex: null, ttype: LEFTBRACKET}, 
  {input: "]", tag: "mo", output: "]", tex: null, ttype: RIGHTBRACKET}, 
  {input: "{", tag: "mo", output: "{", tex: null, ttype: LEFTBRACKET}, 
  {input: "}", tag: "mo", output: "}", tex: null, ttype: RIGHTBRACKET}, 
  {input: "|", tag: "mo", output: "|", tex: null, ttype: LEFTRIGHT},
  //{input:"||", tag:"mo", output:"||", tex:null, ttype:LEFTRIGHT},

  {input: "(:", tag: "mo", output: "\u2329", tex: "langle", ttype: LEFTBRACKET},
  {input: ":)", tag: "mo", output: "\u232A", tex: "rangle", ttype: RIGHTBRACKET},
  {input: "<<", tag: "mo", output: "\u2329", tex: null, ttype: LEFTBRACKET},
  {input: ">>", tag: "mo", output: "\u232A", tex: null, ttype: RIGHTBRACKET},
  {input: "{:", tag: "mo", output: "{:", tex: null, ttype: LEFTBRACKET, invisible: true},
  {input: ":}", tag: "mo", output: ":}", tex: null, ttype: RIGHTBRACKET, invisible: true},

  //miscellaneous symbols

  {input: "int", tag: "mo", output: "\u222B", tex: null, ttype: CONST}, 
  {input: "dx", tag: "mi", output: "{:d x:}", tex: null, ttype: DEFINITION}, 
  {input: "dy", tag: "mi", output: "{:d y:}", tex: null, ttype: DEFINITION}, 
  {input: "dz", tag: "mi", output: "{:d z:}", tex: null, ttype: DEFINITION}, 
  {input: "dt", tag: "mi", output: "{:d t:}", tex: null, ttype: DEFINITION}, 
  {input: "oint", tag: "mo", output: "\u222E", tex: null, ttype: CONST}, 
  {input: "del", tag: "mo", output: "\u2202", tex: "partial", ttype: CONST}, 
  {input: "grad", tag: "mo", output: "\u2207", tex: "nabla", ttype: CONST}, 
  {input: "+-", tag: "mo", output: "\u00B1", tex: "pm", ttype: CONST}, 
  {input: "O/", tag: "mo", output: "\u2205", tex: "emptyset", ttype: CONST}, 
  {input: "oo", tag: "mo", output: "\u221E", tex: "infty", ttype: CONST}, 
  {input: "aleph", tag: "mo", output: "\u2135", tex: null, ttype: CONST}, 
  {input: "...", tag: "mo", output: "...", tex: "ldots", ttype: CONST}, 
  {input: ":.", tag: "mo", output: "\u2234", tex: "therefore", ttype: CONST}, 
  {input: "/_", tag: "mo", output: "\u2220", tex: "angle", ttype: CONST}, 
  {input: "\\ ", tag: "mo", output: "\u00A0", tex: null, ttype: CONST}, 
  {input: "quad", tag: "mo", output: "\u00A0\u00A0", tex: null, ttype: CONST}, 
  {input: "qquad", tag: "mo", output: "\u00A0\u00A0\u00A0\u00A0", tex: null, ttype: CONST}, 
  {input: "cdots", tag: "mo", output: "\u22EF", tex: null, ttype: CONST}, 
  {input: "vdots", tag: "mo", output: "\u22EE", tex: null, ttype: CONST}, 
  {input: "ddots", tag: "mo", output: "\u22F1", tex: null, ttype: CONST}, 
  {input: "diamond", tag: "mo", output: "\u22C4", tex: null, ttype: CONST}, 
  {input: "square", tag: "mo", output: "\u25A1", tex: null, ttype: CONST}, 
  {input: "|__", tag: "mo", output: "\u230A", tex: "lfloor", ttype: CONST}, 
  {input: "__|", tag: "mo", output: "\u230B", tex: "rfloor", ttype: CONST}, 
  {input: "|~", tag: "mo", output: "\u2308", tex: "lceiling", ttype: CONST}, 
  {input: "~|", tag: "mo", output: "\u2309", tex: "rceiling", ttype: CONST}, 
  {input: "CC", tag: "mo", output: "\u2102", tex: null, ttype: CONST}, 
  {input: "NN", tag: "mo", output: "\u2115", tex: null, ttype: CONST}, 
  {input: "QQ", tag: "mo", output: "\u211A", tex: null, ttype: CONST}, 
  {input: "RR", tag: "mo", output: "\u211D", tex: null, ttype: CONST}, 
  {input: "ZZ", tag: "mo", output: "\u2124", tex: null, ttype: CONST},
  {input: "f", tag: "mi", output: "f", tex: null, ttype: UNARY, func: true},
  {input: "g", tag: "mi", output: "g", tex: null, ttype: UNARY, func: true},

  //standard functions

  {input: "lim", tag: "mo", output: "lim", tex: null, ttype: UNDEROVER}, 
  {input: "Lim", tag: "mo", output: "Lim", tex: null, ttype: UNDEROVER},
  {input: "sin", tag: "mo", output: "sin", tex: null, ttype: UNARY, func: true},
  {input: "cos", tag: "mo", output: "cos", tex: null, ttype: UNARY, func: true},
  {input: "tan", tag: "mo", output: "tan", tex: null, ttype: UNARY, func: true},
  {input: "sinh", tag: "mo", output: "sinh", tex: null, ttype: UNARY, func: true},
  {input: "cosh", tag: "mo", output: "cosh", tex: null, ttype: UNARY, func: true},
  {input: "tanh", tag: "mo", output: "tanh", tex: null, ttype: UNARY, func: true},
  {input: "cot", tag: "mo", output: "cot", tex: null, ttype: UNARY, func: true},
  {input: "sec", tag: "mo", output: "sec", tex: null, ttype: UNARY, func: true},
  {input: "csc", tag: "mo", output: "csc", tex: null, ttype: UNARY, func: true},
  {input: "log", tag: "mo", output: "log", tex: null, ttype: UNARY, func: true},
  {input: "ln", tag: "mo", output: "ln", tex: null, ttype: UNARY, func: true},
  {input: "det", tag: "mo", output: "det", tex: null, ttype: UNARY, func: true}, 
  {input: "dim", tag: "mo", output: "dim", tex: null, ttype: CONST}, 
  {input: "mod", tag: "mo", output: "mod", tex: null, ttype: CONST},
  {input: "gcd", tag: "mo", output: "gcd", tex: null, ttype: UNARY, func: true},
  {input: "lcm", tag: "mo", output: "lcm", tex: null, ttype: UNARY, func: true}, 
  {input: "lub", tag: "mo", output: "lub", tex: null, ttype: CONST}, 
  {input: "glb", tag: "mo", output: "glb", tex: null, ttype: CONST}, 
  {input: "min", tag: "mo", output: "min", tex: null, ttype: UNDEROVER}, 
  {input: "max", tag: "mo", output: "max", tex: null, ttype: UNDEROVER},

  //arrows

  {input: "uarr", tag: "mo", output: "\u2191", tex: "uparrow", ttype: CONST}, 
  {input: "darr", tag: "mo", output: "\u2193", tex: "downarrow", ttype: CONST}, 
  {input: "rarr", tag: "mo", output: "\u2192", tex: "rightarrow", ttype: CONST}, 
  {input: "->", tag: "mo", output: "\u2192", tex: "to", ttype: CONST}, 
  {input: ">->", tag: "mo", output: "\u21A3", tex: "rightarrowtail", ttype: CONST}, 
  {input: "->>", tag: "mo", output: "\u21A0", tex: "twoheadrightarrow", ttype: CONST}, 
  {input: ">->>", tag: "mo", output: "\u2916", tex: "twoheadrightarrowtail", ttype: CONST}, 
  {input: "|->", tag: "mo", output: "\u21A6", tex: "mapsto", ttype: CONST}, 
  {input: "larr", tag: "mo", output: "\u2190", tex: "leftarrow", ttype: CONST}, 
  {input: "harr", tag: "mo", output: "\u2194", tex: "leftrightarrow", ttype: CONST}, 
  {input: "rArr", tag: "mo", output: "\u21D2", tex: "Rightarrow", ttype: CONST}, 
  {input: "lArr", tag: "mo", output: "\u21D0", tex: "Leftarrow", ttype: CONST}, 
  {input: "hArr", tag: "mo", output: "\u21D4", tex: "Leftrightarrow", ttype: CONST},
  //commands with argument

  {input: "sqrt", tag: "msqrt", output: "sqrt", tex: null, ttype: UNARY}, 
  {input: "root", tag: "mroot", output: "root", tex: null, ttype: BINARY}, 
  {input: "frac", tag: "mfrac", output: "/", tex: null, ttype: BINARY}, 
  {input: "/", tag: "mfrac", output: "/", tex: null, ttype: INFIX}, 
  {input: "stackrel", tag: "mover", output: "stackrel", tex: null, ttype: BINARY}, 
  {input: "_", tag: "msub", output: "_", tex: null, ttype: INFIX}, 
  {input: "^", tag: "msup", output: "^", tex: null, ttype: INFIX},
  {input: "hat", tag: "mover", output: "^", tex: null, ttype: UNARY, acc: true},
  {input: "bar", tag: "mover", output: "\u00AF", tex: "overline", ttype: UNARY, acc: true},
  {input: "vec", tag: "mover", output: "\u2192", tex: null, ttype: UNARY, acc: true},
  {input: "line", tag: "mover", output: "\u2194", tex: null, ttype: UNARY, acc: true},
  {input: "dot", tag: "mover", output: ".", tex: null, ttype: UNARY, acc: true},
  {input: "ddot", tag: "mover", output: "..", tex: null, ttype: UNARY, acc: true},
  {input: "ul", tag: "munder", output: "\u0332", tex: "underline", ttype: UNARY, acc: true}, 
  {input: "text", tag: "mtext", output: "text", tex: null, ttype: TEXT}, 
  {input: "mbox", tag: "mtext", output: "mbox", tex: null, ttype: TEXT},
  {input: "\"", tag: "mtext", output: "mbox", tex: null, ttype: TEXT},
  {input: "bb", tag: "mstyle", atname: "fontweight", atval: "bold", output: "bb", tex: null, ttype: UNARY},
  {input: "mathbf", tag: "mstyle", atname: "fontweight", atval: "bold", output: "mathbf", tex: null, ttype: UNARY},
  {input: "sf", tag: "mstyle", atname: "fontfamily", atval: "sans-serif", output: "sf", tex: null, ttype: UNARY},
  {input: "mathsf", tag: "mstyle", atname: "fontfamily", atval: "sans-serif", output: "mathsf", tex: null, ttype: UNARY},
  {input: "bbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "bbb", tex: null, ttype: UNARY, codes: AMbbb},
  {input: "mathbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", output: "mathbb", tex: null, ttype: UNARY, codes: AMbbb},
  {input: "cc", tag: "mstyle", atname: "mathvariant", atval: "script", output: "cc", tex: null, ttype: UNARY, codes: AMcal},
  {input: "mathcal", tag: "mstyle", atname: "mathvariant", atval: "script", output: "mathcal", tex: null, ttype: UNARY, codes: AMcal},
  {input: "tt", tag: "mstyle", atname: "fontfamily", atval: "monospace", output: "tt", tex: null, ttype: UNARY},
  {input: "mathtt", tag: "mstyle", atname: "fontfamily", atval: "monospace", output: "mathtt", tex: null, ttype: UNARY},
  {input: "fr", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "fr", tex: null, ttype: UNARY, codes: AMfrk},
  {input: "mathfrak", tag: "mstyle", atname: "mathvariant", atval: "fraktur", output: "mathfrak", tex: null, ttype: UNARY, codes: AMfrk}
];

var texsymbols = [];
for (var i = 0; i < symbols.length; i++) {
  if (symbols[i].tex) {
    texsymbols.push({
      input: symbols[i].tex,
      tag: symbols[i].tag,
      output: symbols[i].output,
      ttype: symbols[i].ttype
    });
  }
}
symbols = symbols.concat(texsymbols);
symbols.sort(compareNames);

module.exports = symbols;

function compareNames(s1, s2) {
  if (s1.input > s2.input) return 1;
  else return -1;
}
