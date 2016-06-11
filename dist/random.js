'use strict';

System.register(['progressbar.js', 'aurelia-framework', 'aurelia-fetch-client'], function (_export, _context) {
  "use strict";

  var ProgressBar, inject, HttpClient, json, _createClass, _dec, _class, RandomCardView;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_progressbarJs) {
      ProgressBar = _progressbarJs.default;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
      json = _aureliaFetchClient.json;
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

      _export('RandomCardView', RandomCardView = (_dec = inject(HttpClient), _dec(_class = function () {
        function RandomCardView(httpClient) {
          _classCallCheck(this, RandomCardView);

          this.themes = null;
          this.card = null;
          this.cardName = '';
          this.themeName = '';
          this.http = null;
          this.bar = null;

          this.http = httpClient;
        }

        RandomCardView.prototype.attached = function attached() {
          var _this = this;

          this.http.fetch('data/grimoire.json').then(function (response) {
            return response.json();
          }).then(function (themeData) {
            _this.themes = themeData.Response.themeCollection;
            _this.updateCard();
          }).catch(function (error) {
            console.error(error);
          });
        };

        RandomCardView.prototype.updateCard = function updateCard() {

          var theme = this.themes[Math.floor(Math.random() * this.themes.length)];
          this.themeName = theme.themeName;
          var page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection.length)];
          this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection.length)];
          this.cardName = this.card.cardName;

          document.getElementById('body').className = 'color-' + this.card.rarity;

          var secs = this.card.cardDescription.split(" ").length / 220 * 60;

          if (this.bar !== null) {
            this.bar.destroy();
          }
          this.bar = new ProgressBar.Line(document.getElementById('progressBar'), {
            duration: secs * 1000,
            color: '#e57373',
            trailColor: '#1565C0',
            svgStyle: {
              width: '100%',
              height: '100%'
            },
            from: {
              color: '#e57373'
            },
            to: {
              color: '#2196F3'
            },
            step: function step(state, bar) {
              bar.path.setAttribute('stroke', state.color);
            }
          });
          this.bar.set(1.0);
          this.bar.animate(0.0);

          var self = this;
          setTimeout(function () {
            self.updateCard();
          }, secs * 1000);
        };

        _createClass(RandomCardView, [{
          key: 'title',
          get: function get() {
            return this.themeName + ' :: ' + this.cardName;
          }
        }]);

        return RandomCardView;
      }()) || _class));

      _export('RandomCardView', RandomCardView);
    }
  };
});
//# sourceMappingURL=random.js.map
