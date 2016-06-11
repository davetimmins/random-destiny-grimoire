/* */ 
(function(process) {
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
})(require('process'));
