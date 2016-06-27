'use strict';

System.register(['progressbar.js', './data-service'], function (_export, _context) {
  "use strict";

  var ProgressBar, fetchGrimoire, _createClass, RandomCardView;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_progressbarJs) {
      ProgressBar = _progressbarJs.default;
    }, function (_dataService) {
      fetchGrimoire = _dataService.fetchGrimoire;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('RandomCardView', RandomCardView = function () {
        function RandomCardView() {
          _classCallCheck(this, RandomCardView);

          this.themes = null;
          this.card = null;
          this.cardName = '';
          this.themeName = '';
          this.bar = null;
          this.color = '#c3c3c3';
          this.shareHref = encodeURIComponent(window.location.href);
          this.timerPlaying = true;
        }

        RandomCardView.prototype.attached = function attached() {
          var _this = this;

          if (localStorage.rdgTimerPlaying) {
            this.timerPlaying = localStorage.rdgTimerPlaying == "true";
          }

          var storedPlaying = localStorage.getItem("rdgTimerPlaying");

          fetchGrimoire().then(function (themeData) {
            _this.themes = themeData;
            _this.updateCard();
          });
        };

        RandomCardView.prototype.updateCard = function updateCard() {
          var _this2 = this;

          window.scrollTo(0, 0);
          var theme = this.themes[Math.floor(Math.random() * this.themes.length)];
          this.themeName = theme.themeName;
          var page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection.length)];
          this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection.length)];
          this.cardName = this.card.cardName;

          document.getElementById('body').className = 'color-' + this.card.rarity;

          var secs = Math.max(this.card.cardDescription.split(" ").length / 200 * 60, 10);

          if (this.bar !== null) {
            this.bar.destroy();
          }

          var colorTo = '#2196F3';
          if (this.card.rarity === 1) {
            this.color = '#2196F3';
          }
          if (this.card.rarity === 2) {
            this.color = '#673AB7';
            colorTo = '#673AB7';
          }
          if (this.card.rarity === 3) {
            this.color = '#FF9800';
            colorTo = '#FF9800';
          }

          this.bar = new ProgressBar.Line(document.getElementById('progressBar'), {
            duration: secs * 1000,
            color: '#f44336',
            trailColor: '#e9e9e9',
            svgStyle: {
              width: '100%',
              height: '100%'
            },
            from: {
              color: '#f44336'
            },
            to: {
              color: colorTo
            },
            step: function step(state, bar) {
              bar.path.setAttribute('stroke', state.color);
            }
          });
          this.bar.set(1.0);

          var timerStop = document.querySelector("#timerStop");
          if (this.timerPlaying) {
            (function () {
              timerStop.classList.add("hidden");
              var self = _this2;
              _this2.bar.animate(0.0, {}, function () {
                self.updateCard();
              });
            })();
          } else {
            timerStop.classList.remove("hidden");
          }
        };

        RandomCardView.prototype.toggleTimer = function toggleTimer() {
          var _this3 = this;

          this.timerPlaying = !this.timerPlaying;
          localStorage.setItem("rdgTimerPlaying", this.timerPlaying);

          var timerStop = document.querySelector("#timerStop");
          if (this.timerPlaying === true) {

            timerStop.classList.add("hidden");

            if (this.bar !== null) {
              (function () {
                var self = _this3;
                _this3.bar.animate(0.0, {
                  duration: _this3.bar._opts.duration * _this3.bar.value()
                }, function () {
                  self.updateCard();
                });
              })();
            }
          } else {

            timerStop.classList.remove("hidden");

            if (this.bar !== null) {
              this.bar.stop();
            }
          }
        };

        RandomCardView.prototype.detached = function detached() {
          if (this.bar !== null) {
            this.bar.destroy();
          }
        };

        _createClass(RandomCardView, [{
          key: 'title',
          get: function get() {
            return this.themeName + ' :: ' + this.cardName;
          }
        }]);

        return RandomCardView;
      }());

      _export('RandomCardView', RandomCardView);
    }
  };
});
//# sourceMappingURL=random.js.map
