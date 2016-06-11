/* */ 
var Shape = require('./shape');
var Circle = require('./circle');
var utils = require('./utils');
var SemiCircle = function SemiCircle(container, options) {
  this._pathTemplate = 'M 50,50 m -{radius},0' + ' a {radius},{radius} 0 1 1 {2radius},0';
  this.containerAspectRatio = 2;
  Shape.apply(this, arguments);
};
SemiCircle.prototype = new Shape();
SemiCircle.prototype.constructor = SemiCircle;
SemiCircle.prototype._initializeSvg = function _initializeSvg(svg, opts) {
  svg.setAttribute('viewBox', '0 0 100 50');
};
SemiCircle.prototype._initializeTextContainer = function _initializeTextContainer(opts, container, textContainer) {
  if (opts.text.style) {
    textContainer.style.top = 'auto';
    textContainer.style.bottom = '0';
    if (opts.text.alignToBottom) {
      utils.setStyle(textContainer, 'transform', 'translate(-50%, 0)');
    } else {
      utils.setStyle(textContainer, 'transform', 'translate(-50%, 50%)');
    }
  }
};
SemiCircle.prototype._pathString = Circle.prototype._pathString;
SemiCircle.prototype._trailString = Circle.prototype._trailString;
module.exports = SemiCircle;
