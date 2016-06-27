'use strict';

System.register(['data-service'], function (_export, _context) {
  "use strict";

  var fetchGrimoire, _createClass, CardView;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_dataService) {
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

      _export('CardView', CardView = function () {
        function CardView() {
          _classCallCheck(this, CardView);

          this.card = null;
          this.cardName = '';
          this.themeName = '';
          this.color = '#c3c3c3';
          this.shareHref = '';
          this.encodedCardName = '';
        }

        CardView.prototype.activate = function activate(params) {
          this.id = params.id;
        };

        CardView.prototype.attached = function attached() {
          var _this = this;

          fetchGrimoire().then(function (themeData) {

            for (var i = 0; i < themeData.length; i++) {
              var theme = themeData[i];

              for (var j = 0; j < theme.pageCollection.length; j++) {
                var page = theme.pageCollection[j];

                for (var k = 0; k < page.cardCollection.length; k++) {
                  var card = page.cardCollection[k];

                  if (card.cardId == _this.id) {
                    _this.shareHref = encodeURIComponent(window.location.href);
                    _this.encodedCardName = encodeURIComponent(card.cardName);
                    _this.themeName = theme.themeName;
                    _this.card = card;
                    _this.cardName = card.cardName;
                    document.getElementById('body').className = 'color-' + card.rarity;
                    if (card.rarity === 1) {
                      _this.color = '#2196F3';
                    }
                    if (card.rarity === 2) {
                      _this.color = '#673AB7';
                    }
                    if (card.rarity === 3) {
                      _this.color = '#FF9800';
                    }
                    break;
                  }
                }
              }
            }
          });
        };

        _createClass(CardView, [{
          key: 'title',
          get: function get() {
            return this.themeName + ' :: ' + this.cardName;
          }
        }]);

        return CardView;
      }());

      _export('CardView', CardView);
    }
  };
});
//# sourceMappingURL=card.js.map
