/* */ 
var Tweenable = require('shifty');
var utils = require('./utils');
var EASING_ALIASES = {
  easeIn: 'easeInCubic',
  easeOut: 'easeOutCubic',
  easeInOut: 'easeInOutCubic'
};
var Path = function Path(path, opts) {
  if (!(this instanceof Path)) {
    throw new Error('Constructor was called without new keyword');
  }
  opts = utils.extend({
    duration: 800,
    easing: 'linear',
    from: {},
    to: {},
    step: function() {}
  }, opts);
  var element;
  if (utils.isString(path)) {
    element = document.querySelector(path);
  } else {
    element = path;
  }
  this.path = element;
  this._opts = opts;
  this._tweenable = null;
  var length = this.path.getTotalLength();
  this.path.style.strokeDasharray = length + ' ' + length;
  this.set(0);
};
Path.prototype.value = function value() {
  var offset = this._getComputedDashOffset();
  var length = this.path.getTotalLength();
  var progress = 1 - offset / length;
  return parseFloat(progress.toFixed(6), 10);
};
Path.prototype.set = function set(progress) {
  this.stop();
  this.path.style.strokeDashoffset = this._progressToOffset(progress);
  var step = this._opts.step;
  if (utils.isFunction(step)) {
    var easing = this._easing(this._opts.easing);
    var values = this._calculateTo(progress, easing);
    var reference = this._opts.shape || this;
    step(values, reference, this._opts.attachment);
  }
};
Path.prototype.stop = function stop() {
  this._stopTween();
  this.path.style.strokeDashoffset = this._getComputedDashOffset();
};
Path.prototype.animate = function animate(progress, opts, cb) {
  opts = opts || {};
  if (utils.isFunction(opts)) {
    cb = opts;
    opts = {};
  }
  var passedOpts = utils.extend({}, opts);
  var defaultOpts = utils.extend({}, this._opts);
  opts = utils.extend(defaultOpts, opts);
  var shiftyEasing = this._easing(opts.easing);
  var values = this._resolveFromAndTo(progress, shiftyEasing, passedOpts);
  this.stop();
  this.path.getBoundingClientRect();
  var offset = this._getComputedDashOffset();
  var newOffset = this._progressToOffset(progress);
  var self = this;
  this._tweenable = new Tweenable();
  this._tweenable.tween({
    from: utils.extend({offset: offset}, values.from),
    to: utils.extend({offset: newOffset}, values.to),
    duration: opts.duration,
    easing: shiftyEasing,
    step: function(state) {
      self.path.style.strokeDashoffset = state.offset;
      var reference = opts.shape || self;
      opts.step(state, reference, opts.attachment);
    },
    finish: function(state) {
      if (utils.isFunction(cb)) {
        cb();
      }
    }
  });
};
Path.prototype._getComputedDashOffset = function _getComputedDashOffset() {
  var computedStyle = window.getComputedStyle(this.path, null);
  return parseFloat(computedStyle.getPropertyValue('stroke-dashoffset'), 10);
};
Path.prototype._progressToOffset = function _progressToOffset(progress) {
  var length = this.path.getTotalLength();
  return length - progress * length;
};
Path.prototype._resolveFromAndTo = function _resolveFromAndTo(progress, easing, opts) {
  if (opts.from && opts.to) {
    return {
      from: opts.from,
      to: opts.to
    };
  }
  return {
    from: this._calculateFrom(easing),
    to: this._calculateTo(progress, easing)
  };
};
Path.prototype._calculateFrom = function _calculateFrom(easing) {
  return Tweenable.interpolate(this._opts.from, this._opts.to, this.value(), easing);
};
Path.prototype._calculateTo = function _calculateTo(progress, easing) {
  return Tweenable.interpolate(this._opts.from, this._opts.to, progress, easing);
};
Path.prototype._stopTween = function _stopTween() {
  if (this._tweenable !== null) {
    this._tweenable.stop();
    this._tweenable = null;
  }
};
Path.prototype._easing = function _easing(easing) {
  if (EASING_ALIASES.hasOwnProperty(easing)) {
    return EASING_ALIASES[easing];
  }
  return easing;
};
module.exports = Path;
