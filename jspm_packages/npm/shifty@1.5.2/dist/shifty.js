/* */ 
"format cjs";
(function(process) {
  ;
  (function() {
    var root = this || Function('return this')();
    var Tweenable = (function() {
      'use strict';
      var formula;
      var DEFAULT_SCHEDULE_FUNCTION;
      var DEFAULT_EASING = 'linear';
      var DEFAULT_DURATION = 500;
      var UPDATE_TIME = 1000 / 60;
      var _now = Date.now ? Date.now : function() {
        return +new Date();
      };
      var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;
      if (typeof window !== 'undefined') {
        DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame) || setTimeout;
      } else {
        DEFAULT_SCHEDULE_FUNCTION = setTimeout;
      }
      function noop() {}
      function each(obj, fn) {
        var key;
        for (key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            fn(key);
          }
        }
      }
      function shallowCopy(targetObj, srcObj) {
        each(srcObj, function(prop) {
          targetObj[prop] = srcObj[prop];
        });
        return targetObj;
      }
      function defaults(target, src) {
        each(src, function(prop) {
          if (typeof target[prop] === 'undefined') {
            target[prop] = src[prop];
          }
        });
      }
      function tweenProps(forPosition, currentState, originalState, targetState, duration, timestamp, easing) {
        var normalizedPosition = forPosition < timestamp ? 0 : (forPosition - timestamp) / duration;
        var prop;
        var easingObjectProp;
        var easingFn;
        for (prop in currentState) {
          if (currentState.hasOwnProperty(prop)) {
            easingObjectProp = easing[prop];
            easingFn = typeof easingObjectProp === 'function' ? easingObjectProp : formula[easingObjectProp];
            currentState[prop] = tweenProp(originalState[prop], targetState[prop], easingFn, normalizedPosition);
          }
        }
        return currentState;
      }
      function tweenProp(start, end, easingFunc, position) {
        return start + (end - start) * easingFunc(position);
      }
      function applyFilter(tweenable, filterName) {
        var filters = Tweenable.prototype.filter;
        var args = tweenable._filterArgs;
        each(filters, function(name) {
          if (typeof filters[name][filterName] !== 'undefined') {
            filters[name][filterName].apply(tweenable, args);
          }
        });
      }
      var timeoutHandler_endTime;
      var timeoutHandler_currentTime;
      var timeoutHandler_isEnded;
      var timeoutHandler_offset;
      function timeoutHandler(tweenable, timestamp, delay, duration, currentState, originalState, targetState, easing, step, schedule, opt_currentTimeOverride) {
        timeoutHandler_endTime = timestamp + delay + duration;
        timeoutHandler_currentTime = Math.min(opt_currentTimeOverride || now(), timeoutHandler_endTime);
        timeoutHandler_isEnded = timeoutHandler_currentTime >= timeoutHandler_endTime;
        timeoutHandler_offset = duration - (timeoutHandler_endTime - timeoutHandler_currentTime);
        if (tweenable.isPlaying()) {
          if (timeoutHandler_isEnded) {
            step(targetState, tweenable._attachment, timeoutHandler_offset);
            tweenable.stop(true);
          } else {
            tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);
            applyFilter(tweenable, 'beforeTween');
            if (timeoutHandler_currentTime < (timestamp + delay)) {
              tweenProps(1, currentState, originalState, targetState, 1, 1, easing);
            } else {
              tweenProps(timeoutHandler_currentTime, currentState, originalState, targetState, duration, timestamp + delay, easing);
            }
            applyFilter(tweenable, 'afterTween');
            step(currentState, tweenable._attachment, timeoutHandler_offset);
          }
        }
      }
      function composeEasingObject(fromTweenParams, easing) {
        var composedEasing = {};
        var typeofEasing = typeof easing;
        if (typeofEasing === 'string' || typeofEasing === 'function') {
          each(fromTweenParams, function(prop) {
            composedEasing[prop] = easing;
          });
        } else {
          each(fromTweenParams, function(prop) {
            if (!composedEasing[prop]) {
              composedEasing[prop] = easing[prop] || DEFAULT_EASING;
            }
          });
        }
        return composedEasing;
      }
      function Tweenable(opt_initialState, opt_config) {
        this._currentState = opt_initialState || {};
        this._configured = false;
        this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;
        if (typeof opt_config !== 'undefined') {
          this.setConfig(opt_config);
        }
      }
      Tweenable.prototype.tween = function(opt_config) {
        if (this._isTweening) {
          return this;
        }
        if (opt_config !== undefined || !this._configured) {
          this.setConfig(opt_config);
        }
        this._timestamp = now();
        this._start(this.get(), this._attachment);
        return this.resume();
      };
      Tweenable.prototype.setConfig = function(config) {
        config = config || {};
        this._configured = true;
        this._attachment = config.attachment;
        this._pausedAtTime = null;
        this._scheduleId = null;
        this._delay = config.delay || 0;
        this._start = config.start || noop;
        this._step = config.step || noop;
        this._finish = config.finish || noop;
        this._duration = config.duration || DEFAULT_DURATION;
        this._currentState = shallowCopy({}, config.from) || this.get();
        this._originalState = this.get();
        this._targetState = shallowCopy({}, config.to) || this.get();
        var self = this;
        this._timeoutHandler = function() {
          timeoutHandler(self, self._timestamp, self._delay, self._duration, self._currentState, self._originalState, self._targetState, self._easing, self._step, self._scheduleFunction);
        };
        var currentState = this._currentState;
        var targetState = this._targetState;
        defaults(targetState, currentState);
        this._easing = composeEasingObject(currentState, config.easing || DEFAULT_EASING);
        this._filterArgs = [currentState, this._originalState, targetState, this._easing];
        applyFilter(this, 'tweenCreated');
        return this;
      };
      Tweenable.prototype.get = function() {
        return shallowCopy({}, this._currentState);
      };
      Tweenable.prototype.set = function(state) {
        this._currentState = state;
      };
      Tweenable.prototype.pause = function() {
        this._pausedAtTime = now();
        this._isPaused = true;
        return this;
      };
      Tweenable.prototype.resume = function() {
        if (this._isPaused) {
          this._timestamp += now() - this._pausedAtTime;
        }
        this._isPaused = false;
        this._isTweening = true;
        this._timeoutHandler();
        return this;
      };
      Tweenable.prototype.seek = function(millisecond) {
        millisecond = Math.max(millisecond, 0);
        var currentTime = now();
        if ((this._timestamp + millisecond) === 0) {
          return this;
        }
        this._timestamp = currentTime - millisecond;
        if (!this.isPlaying()) {
          this._isTweening = true;
          this._isPaused = false;
          timeoutHandler(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, currentTime);
          this.pause();
        }
        return this;
      };
      Tweenable.prototype.stop = function(gotoEnd) {
        this._isTweening = false;
        this._isPaused = false;
        this._timeoutHandler = noop;
        (root.cancelAnimationFrame || root.webkitCancelAnimationFrame || root.oCancelAnimationFrame || root.msCancelAnimationFrame || root.mozCancelRequestAnimationFrame || root.clearTimeout)(this._scheduleId);
        if (gotoEnd) {
          applyFilter(this, 'beforeTween');
          tweenProps(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing);
          applyFilter(this, 'afterTween');
          applyFilter(this, 'afterTweenEnd');
          this._finish.call(this, this._currentState, this._attachment);
        }
        return this;
      };
      Tweenable.prototype.isPlaying = function() {
        return this._isTweening && !this._isPaused;
      };
      Tweenable.prototype.setScheduleFunction = function(scheduleFunction) {
        this._scheduleFunction = scheduleFunction;
      };
      Tweenable.prototype.dispose = function() {
        var prop;
        for (prop in this) {
          if (this.hasOwnProperty(prop)) {
            delete this[prop];
          }
        }
      };
      Tweenable.prototype.filter = {};
      Tweenable.prototype.formula = {linear: function(pos) {
          return pos;
        }};
      formula = Tweenable.prototype.formula;
      shallowCopy(Tweenable, {
        'now': now,
        'each': each,
        'tweenProps': tweenProps,
        'tweenProp': tweenProp,
        'applyFilter': applyFilter,
        'shallowCopy': shallowCopy,
        'defaults': defaults,
        'composeEasingObject': composeEasingObject
      });
      if (typeof SHIFTY_DEBUG_NOW === 'function') {
        root.timeoutHandler = timeoutHandler;
      }
      if (typeof exports === 'object') {
        module.exports = Tweenable;
      } else if (typeof define === 'function' && define.amd) {
        define(function() {
          return Tweenable;
        });
      } else if (typeof root.Tweenable === 'undefined') {
        root.Tweenable = Tweenable;
      }
      return Tweenable;
    }());
    ;
    (function() {
      Tweenable.shallowCopy(Tweenable.prototype.formula, {
        easeInQuad: function(pos) {
          return Math.pow(pos, 2);
        },
        easeOutQuad: function(pos) {
          return -(Math.pow((pos - 1), 2) - 1);
        },
        easeInOutQuad: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 2);
          }
          return -0.5 * ((pos -= 2) * pos - 2);
        },
        easeInCubic: function(pos) {
          return Math.pow(pos, 3);
        },
        easeOutCubic: function(pos) {
          return (Math.pow((pos - 1), 3) + 1);
        },
        easeInOutCubic: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
          }
          return 0.5 * (Math.pow((pos - 2), 3) + 2);
        },
        easeInQuart: function(pos) {
          return Math.pow(pos, 4);
        },
        easeOutQuart: function(pos) {
          return -(Math.pow((pos - 1), 4) - 1);
        },
        easeInOutQuart: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 4);
          }
          return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
        },
        easeInQuint: function(pos) {
          return Math.pow(pos, 5);
        },
        easeOutQuint: function(pos) {
          return (Math.pow((pos - 1), 5) + 1);
        },
        easeInOutQuint: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2);
        },
        easeInSine: function(pos) {
          return -Math.cos(pos * (Math.PI / 2)) + 1;
        },
        easeOutSine: function(pos) {
          return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: function(pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInExpo: function(pos) {
          return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
        },
        easeOutExpo: function(pos) {
          return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
        },
        easeInOutExpo: function(pos) {
          if (pos === 0) {
            return 0;
          }
          if (pos === 1) {
            return 1;
          }
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(2, 10 * (pos - 1));
          }
          return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
        },
        easeInCirc: function(pos) {
          return -(Math.sqrt(1 - (pos * pos)) - 1);
        },
        easeOutCirc: function(pos) {
          return Math.sqrt(1 - Math.pow((pos - 1), 2));
        },
        easeInOutCirc: function(pos) {
          if ((pos /= 0.5) < 1) {
            return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
          }
          return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
        },
        easeOutBounce: function(pos) {
          if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
          } else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
          } else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
          } else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
          }
        },
        easeInBack: function(pos) {
          var s = 1.70158;
          return (pos) * pos * ((s + 1) * pos - s);
        },
        easeOutBack: function(pos) {
          var s = 1.70158;
          return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
        },
        easeInOutBack: function(pos) {
          var s = 1.70158;
          if ((pos /= 0.5) < 1) {
            return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
          }
          return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
        },
        elastic: function(pos) {
          return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
        },
        swingFromTo: function(pos) {
          var s = 1.70158;
          return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
        },
        swingFrom: function(pos) {
          var s = 1.70158;
          return pos * pos * ((s + 1) * pos - s);
        },
        swingTo: function(pos) {
          var s = 1.70158;
          return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        },
        bounce: function(pos) {
          if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
          } else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
          } else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
          } else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
          }
        },
        bouncePast: function(pos) {
          if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
          } else if (pos < (2 / 2.75)) {
            return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
          } else if (pos < (2.5 / 2.75)) {
            return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
          } else {
            return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
          }
        },
        easeFromTo: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 4);
          }
          return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
        },
        easeFrom: function(pos) {
          return Math.pow(pos, 4);
        },
        easeTo: function(pos) {
          return Math.pow(pos, 0.25);
        }
      });
    }());
    ;
    (function() {
      function cubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
        var ax = 0,
            bx = 0,
            cx = 0,
            ay = 0,
            by = 0,
            cy = 0;
        function sampleCurveX(t) {
          return ((ax * t + bx) * t + cx) * t;
        }
        function sampleCurveY(t) {
          return ((ay * t + by) * t + cy) * t;
        }
        function sampleCurveDerivativeX(t) {
          return (3.0 * ax * t + 2.0 * bx) * t + cx;
        }
        function solveEpsilon(duration) {
          return 1.0 / (200.0 * duration);
        }
        function solve(x, epsilon) {
          return sampleCurveY(solveCurveX(x, epsilon));
        }
        function fabs(n) {
          if (n >= 0) {
            return n;
          } else {
            return 0 - n;
          }
        }
        function solveCurveX(x, epsilon) {
          var t0,
              t1,
              t2,
              x2,
              d2,
              i;
          for (t2 = x, i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x;
            if (fabs(x2) < epsilon) {
              return t2;
            }
            d2 = sampleCurveDerivativeX(t2);
            if (fabs(d2) < 1e-6) {
              break;
            }
            t2 = t2 - x2 / d2;
          }
          t0 = 0.0;
          t1 = 1.0;
          t2 = x;
          if (t2 < t0) {
            return t0;
          }
          if (t2 > t1) {
            return t1;
          }
          while (t0 < t1) {
            x2 = sampleCurveX(t2);
            if (fabs(x2 - x) < epsilon) {
              return t2;
            }
            if (x > x2) {
              t0 = t2;
            } else {
              t1 = t2;
            }
            t2 = (t1 - t0) * 0.5 + t0;
          }
          return t2;
        }
        cx = 3.0 * p1x;
        bx = 3.0 * (p2x - p1x) - cx;
        ax = 1.0 - cx - bx;
        cy = 3.0 * p1y;
        by = 3.0 * (p2y - p1y) - cy;
        ay = 1.0 - cy - by;
        return solve(t, solveEpsilon(duration));
      }
      function getCubicBezierTransition(x1, y1, x2, y2) {
        return function(pos) {
          return cubicBezierAtTime(pos, x1, y1, x2, y2, 1);
        };
      }
      Tweenable.setBezierFunction = function(name, x1, y1, x2, y2) {
        var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
        cubicBezierTransition.displayName = name;
        cubicBezierTransition.x1 = x1;
        cubicBezierTransition.y1 = y1;
        cubicBezierTransition.x2 = x2;
        cubicBezierTransition.y2 = y2;
        return Tweenable.prototype.formula[name] = cubicBezierTransition;
      };
      Tweenable.unsetBezierFunction = function(name) {
        delete Tweenable.prototype.formula[name];
      };
    })();
    ;
    (function() {
      function getInterpolatedValues(from, current, targetState, position, easing, delay) {
        return Tweenable.tweenProps(position, current, from, targetState, 1, delay, easing);
      }
      var mockTweenable = new Tweenable();
      mockTweenable._filterArgs = [];
      Tweenable.interpolate = function(from, targetState, position, easing, opt_delay) {
        var current = Tweenable.shallowCopy({}, from);
        var delay = opt_delay || 0;
        var easingObject = Tweenable.composeEasingObject(from, easing || 'linear');
        mockTweenable.set({});
        var filterArgs = mockTweenable._filterArgs;
        filterArgs.length = 0;
        filterArgs[0] = current;
        filterArgs[1] = from;
        filterArgs[2] = targetState;
        filterArgs[3] = easingObject;
        Tweenable.applyFilter(mockTweenable, 'tweenCreated');
        Tweenable.applyFilter(mockTweenable, 'beforeTween');
        var interpolatedValues = getInterpolatedValues(from, current, targetState, position, easingObject, delay);
        Tweenable.applyFilter(mockTweenable, 'afterTween');
        return interpolatedValues;
      };
    }());
    ;
    (function(Tweenable) {
      var formatManifest;
      var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
      var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
      var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
      var R_RGB = new RegExp('rgb\\(' + R_UNFORMATTED_VALUES.source + (/,\s*/.source) + R_UNFORMATTED_VALUES.source + (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
      var R_RGB_PREFIX = /^.*\(/;
      var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
      var VALUE_PLACEHOLDER = 'VAL';
      function getFormatChunksFrom(rawValues, prefix) {
        var accumulator = [];
        var rawValuesLength = rawValues.length;
        var i;
        for (i = 0; i < rawValuesLength; i++) {
          accumulator.push('_' + prefix + '_' + i);
        }
        return accumulator;
      }
      function getFormatStringFrom(formattedString) {
        var chunks = formattedString.match(R_FORMAT_CHUNKS);
        if (!chunks) {
          chunks = ['', ''];
        } else if (chunks.length === 1 || formattedString[0].match(R_NUMBER_COMPONENT)) {
          chunks.unshift('');
        }
        return chunks.join(VALUE_PLACEHOLDER);
      }
      function sanitizeObjectForHexProps(stateObject) {
        Tweenable.each(stateObject, function(prop) {
          var currentProp = stateObject[prop];
          if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
            stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
          }
        });
      }
      function sanitizeHexChunksToRGB(str) {
        return filterStringChunks(R_HEX, str, convertHexToRGB);
      }
      function convertHexToRGB(hexString) {
        var rgbArr = hexToRGBArray(hexString);
        return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
      }
      var hexToRGBArray_returnArray = [];
      function hexToRGBArray(hex) {
        hex = hex.replace(/#/, '');
        if (hex.length === 3) {
          hex = hex.split('');
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
        hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
        hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));
        return hexToRGBArray_returnArray;
      }
      function hexToDec(hex) {
        return parseInt(hex, 16);
      }
      function filterStringChunks(pattern, unfilteredString, filter) {
        var pattenMatches = unfilteredString.match(pattern);
        var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);
        if (pattenMatches) {
          var pattenMatchesLength = pattenMatches.length;
          var currentChunk;
          for (var i = 0; i < pattenMatchesLength; i++) {
            currentChunk = pattenMatches.shift();
            filteredString = filteredString.replace(VALUE_PLACEHOLDER, filter(currentChunk));
          }
        }
        return filteredString;
      }
      function sanitizeRGBChunks(formattedString) {
        return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
      }
      function sanitizeRGBChunk(rgbChunk) {
        var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
        var numbersLength = numbers.length;
        var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];
        for (var i = 0; i < numbersLength; i++) {
          sanitizedString += parseInt(numbers[i], 10) + ',';
        }
        sanitizedString = sanitizedString.slice(0, -1) + ')';
        return sanitizedString;
      }
      function getFormatManifests(stateObject) {
        var manifestAccumulator = {};
        Tweenable.each(stateObject, function(prop) {
          var currentProp = stateObject[prop];
          if (typeof currentProp === 'string') {
            var rawValues = getValuesFrom(currentProp);
            manifestAccumulator[prop] = {
              'formatString': getFormatStringFrom(currentProp),
              'chunkNames': getFormatChunksFrom(rawValues, prop)
            };
          }
        });
        return manifestAccumulator;
      }
      function expandFormattedProperties(stateObject, formatManifests) {
        Tweenable.each(formatManifests, function(prop) {
          var currentProp = stateObject[prop];
          var rawValues = getValuesFrom(currentProp);
          var rawValuesLength = rawValues.length;
          for (var i = 0; i < rawValuesLength; i++) {
            stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
          }
          delete stateObject[prop];
        });
      }
      function collapseFormattedProperties(stateObject, formatManifests) {
        Tweenable.each(formatManifests, function(prop) {
          var currentProp = stateObject[prop];
          var formatChunks = extractPropertyChunks(stateObject, formatManifests[prop].chunkNames);
          var valuesList = getValuesList(formatChunks, formatManifests[prop].chunkNames);
          currentProp = getFormattedValues(formatManifests[prop].formatString, valuesList);
          stateObject[prop] = sanitizeRGBChunks(currentProp);
        });
      }
      function extractPropertyChunks(stateObject, chunkNames) {
        var extractedValues = {};
        var currentChunkName,
            chunkNamesLength = chunkNames.length;
        for (var i = 0; i < chunkNamesLength; i++) {
          currentChunkName = chunkNames[i];
          extractedValues[currentChunkName] = stateObject[currentChunkName];
          delete stateObject[currentChunkName];
        }
        return extractedValues;
      }
      var getValuesList_accumulator = [];
      function getValuesList(stateObject, chunkNames) {
        getValuesList_accumulator.length = 0;
        var chunkNamesLength = chunkNames.length;
        for (var i = 0; i < chunkNamesLength; i++) {
          getValuesList_accumulator.push(stateObject[chunkNames[i]]);
        }
        return getValuesList_accumulator;
      }
      function getFormattedValues(formatString, rawValues) {
        var formattedValueString = formatString;
        var rawValuesLength = rawValues.length;
        for (var i = 0; i < rawValuesLength; i++) {
          formattedValueString = formattedValueString.replace(VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
        }
        return formattedValueString;
      }
      function getValuesFrom(formattedString) {
        return formattedString.match(R_UNFORMATTED_VALUES);
      }
      function expandEasingObject(easingObject, tokenData) {
        Tweenable.each(tokenData, function(prop) {
          var currentProp = tokenData[prop];
          var chunkNames = currentProp.chunkNames;
          var chunkLength = chunkNames.length;
          var easing = easingObject[prop];
          var i;
          if (typeof easing === 'string') {
            var easingChunks = easing.split(' ');
            var lastEasingChunk = easingChunks[easingChunks.length - 1];
            for (i = 0; i < chunkLength; i++) {
              easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
            }
          } else {
            for (i = 0; i < chunkLength; i++) {
              easingObject[chunkNames[i]] = easing;
            }
          }
          delete easingObject[prop];
        });
      }
      function collapseEasingObject(easingObject, tokenData) {
        Tweenable.each(tokenData, function(prop) {
          var currentProp = tokenData[prop];
          var chunkNames = currentProp.chunkNames;
          var chunkLength = chunkNames.length;
          var firstEasing = easingObject[chunkNames[0]];
          var typeofEasings = typeof firstEasing;
          if (typeofEasings === 'string') {
            var composedEasingString = '';
            for (var i = 0; i < chunkLength; i++) {
              composedEasingString += ' ' + easingObject[chunkNames[i]];
              delete easingObject[chunkNames[i]];
            }
            easingObject[prop] = composedEasingString.substr(1);
          } else {
            easingObject[prop] = firstEasing;
          }
        });
      }
      Tweenable.prototype.filter.token = {
        'tweenCreated': function(currentState, fromState, toState, easingObject) {
          sanitizeObjectForHexProps(currentState);
          sanitizeObjectForHexProps(fromState);
          sanitizeObjectForHexProps(toState);
          this._tokenData = getFormatManifests(currentState);
        },
        'beforeTween': function(currentState, fromState, toState, easingObject) {
          expandEasingObject(easingObject, this._tokenData);
          expandFormattedProperties(currentState, this._tokenData);
          expandFormattedProperties(fromState, this._tokenData);
          expandFormattedProperties(toState, this._tokenData);
        },
        'afterTween': function(currentState, fromState, toState, easingObject) {
          collapseFormattedProperties(currentState, this._tokenData);
          collapseFormattedProperties(fromState, this._tokenData);
          collapseFormattedProperties(toState, this._tokenData);
          collapseEasingObject(easingObject, this._tokenData);
        }
      };
    }(Tweenable));
  }).call(null);
})(require('process'));
