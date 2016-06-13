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
          this.id = '';
          this.color = '#c3c3c3';

          this.http = httpClient;
        }

        CardView.prototype.activate = function activate(params) {
          this.id = params.id;
        };

        CardView.prototype.attached = function attached() {
          var self = this;
          this.http.fetch('data/grimoire.json').then(function (response) {
            return response.json();
          }).then(function (themeData) {

            for (var i = 0; i < themeData.Response.themeCollection.length; i++) {
              var theme = themeData.Response.themeCollection[i];

              for (var j = 0; j < theme.pageCollection.length; j++) {
                var page = theme.pageCollection[j];

                for (var k = 0; k < page.cardCollection.length; k++) {
                  var card = page.cardCollection[k];

                  if (card.cardId == self.id) {
                    self.themeName = theme.themeName;
                    self.card = card;
                    self.cardName = card.cardName;
                    document.getElementById('body').className = 'color-' + card.rarity;
                    if (card.rarity === 1) {
                      self.color = '#2196F3';
                    }
                    if (card.rarity === 2) {
                      self.color = '#4A148C';
                    }
                    if (card.rarity === 3) {
                      self.color = '#FF6F00';
                    }
                    break;
                  }
                }
              }
            }
          }).catch(function (error) {
            console.error(error);
          });
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
//# sourceMappingURL=card.js.map
