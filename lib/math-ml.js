var escapeStr = require('./escape');

exports.Node = Node;
exports.Text = Text;

function Node(type) {
  this.firstChild = null;
  this.lastChild = null;
  this.nodeName = type;
  this.childNodes = [];
  this.attributes = {};
}
Node.prototype.toElement = function () {
  var el = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.nodeName);
  for (var i = 0; i < this.childNodes.length; i++) {
    el.appendChild(this.childNodes[i].toElement());
  }
  var attributes = Object.keys(this.attributes);
  for (var i = 0; i < attributes.length; i++) {
    el.setAttribute(attributes[i], this.attributes[attributes[i]]);
  }
  return el;
}

Node.prototype.toString = function () {
  var buf = [];
  buf.push('<', this.nodeName);
  var attributes = Object.keys(this.attributes);
  for (var i = 0; i < attributes.length; i++) {
    buf.push(' ', attributes[i], '="', this.attributes[attributes[i]], '"');
  }
  buf.push('>');
  for (var i = 0; i < this.childNodes.length; i++) {
    buf.push(this.childNodes[i].toString());
  }

  buf.push('</' + this.nodeName + '>');
  return buf.join('');
}

Node.prototype.setAttribute = function (attr, val) {
  this.attributes[attr] = val;
};
Node.prototype.appendChild = function (child) {
  if (typeof child === 'string') {
    this.appendChild(new Text(child), true);
  } else if (child.nodeName === 'fragment') {
    var len = child.childNodes.length;
    for (var i = 0; i < len; i++) {
      this.appendChild(child.childNodes[0], true);
    }
  } else {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
  }
  this.updateChildNodes();
  return child;
};
Node.prototype.removeChild = function (child) {
  child.nextSibling = null;
  var removed = false;
  this.childNodes = this.childNodes.filter(function (c) {
    if (!removed && c === child) {
      removed = true;
      return false;
    } else {
      return true;
    }
  });
  child.parentNode = null;
  this.updateChildNodes();
  return child;
}
Node.prototype.replaceChild = function (newChild, oldChild) {
  if (newChild.parentNode) newChild.parentNode.removeChild(child);
  newChild.parentNode = this;
  this.childNodes = this.childNodes.map(function (c) {
    if (c === oldChild) return newChild;
    else return c;
  });
  oldChild.parentNode = null;
  this.updateChildNodes();
  return oldChild;
};
Node.prototype.updateChildNodes = function () {
  if (this.childNodes.length === 0) {
    this.firstChild = null;
    this.lastChild = null;
  } else {
    this.firstChild = this.childNodes[0];
    this.lastChild = this.childNodes[this.childNodes.length - 1];
  }
  for (var i = 0; i < this.childNodes.length; i++) {
    this.childNodes[i].nextSibling = this.childNodes[i+1] || null;
  }
};

function Text(text) {
  this.nodeValue = text;
}
Text.prototype.toElement = function () {
  return document.createTextNode(this.nodeValue);
};
Text.prototype.toString = function () {
  return escapeStr(this.nodeValue);
};