'use strict';

System.register(['aurelia-framework', 'aurelia-fetch-client'], function (_export, _context) {
  "use strict";

  var inject, HttpClient, json, _createClass, _dec, _class, CardView;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
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

      _export('CardView', CardView = (_dec = inject(HttpClient), _dec(_class = function () {
        function CardView(httpClient) {
          _classCallCheck(this, CardView);

          this.themes = null;
          this.card = null;
          this.cardName = '';
          this.themeName = '';
          this.http = null;
          this.progressTimeout = null;

          this.http = httpClient;
        }

        CardView.prototype.attached = function attached() {
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

        CardView.prototype.updateCard = function updateCard() {

          $('#progressBar').hide();
          var theme = this.themes[Math.floor(Math.random() * this.themes.length)];
          this.themeName = theme.themeName;
          var page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection.length)];
          this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection.length)];
          this.cardName = this.card.cardName;

          document.getElementById('body').className = 'color-' + this.card.rarity;

          var secs = this.card.cardDescription.split(" ").length / 220 * 60;
          this.progress(secs, secs, $('#progressBar'), true);
        };

        CardView.prototype.progress = function progress(timeleft, timetotal, $element, cancel) {

          if (cancel === true && this.progressTimeout) {
            $('#progressBar').hide();
            clearTimeout(this.progressTimeout);
          }

          var progressBarWidth = timeleft * $element.width() / timetotal;
          $element.find('div').animate({ width: progressBarWidth }, timeleft === timetotal ? 0 : 1000, 'linear');

          if (timeleft > -1) {
            $('#progressBar').show();
            var self = this;
            this.progressTimeout = setTimeout(function () {
              self.progress(timeleft - 1, timetotal, $element, false);
            }, 1000);
          } else {
            $('#progressBar').hide();
            this.updateCard();
          }
        };

        _createClass(CardView, [{
          key: 'title',
          get: function get() {
            return this.themeName + ' :: ' + this.cardName;
          }
        }]);

        return CardView;
      }()) || _class));

      _export('CardView', CardView);
    }
  };
});
//# sourceMappingURL=app.js.map
