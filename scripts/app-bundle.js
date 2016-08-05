define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{
        route: ['', 'random'],
        name: 'random',
        moduleId: './random',
        nav: true,
        title: 'Random Grimoire'
      }, {
        route: 'card/:id',
        name: 'card',
        moduleId: './card',
        nav: false,
        title: 'Grimoire Card'
      }]);

      this.router = router;
    };

    return App;
  }();
});
define('card',['exports', 'data-service'], function (exports, _dataService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CardView = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var CardView = exports.CardView = function () {
    function CardView() {
      _classCallCheck(this, CardView);

      this.card = null;
      this.cardName = '';
      this.pageName = '';
      this.themeName = '';
      this.color = 'footer-color-1';
      this.shareHref = '';
      this.encodedCardName = '';
    }

    CardView.prototype.activate = function activate(params) {
      this.id = params.id;
    };

    CardView.prototype.attached = function attached() {
      var _this = this;

      (0, _dataService.fetchGrimoire)().then(function (themeData) {

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
                _this.pageName = page.pageName;
                document.getElementById('body').className = 'color-' + card.rarity;
                _this.color = 'footer-color-' + card.rarity;
                document.getElementById('grimoire-card').scrollIntoView();
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
        return '' + this.cardName;
      }
    }, {
      key: 'categoryTitle',
      get: function get() {
        return this.themeName + ' :: ' + this.pageName;
      }
    }]);

    return CardView;
  }();
});
define('data-service',['exports', 'aurelia-fetch-client'], function (exports, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fetchGrimoire = fetchGrimoire;
  function fetchGrimoire() {

    if (localStorage.grimoire) {

      return new Promise(function (resolve, reject) {
        resolve(JSON.parse(localStorage.getItem("grimoire")));
      });
    }

    var client = new _aureliaFetchClient.HttpClient();
    return client.fetch('data/grimoire.json').then(function (response) {
      return response.json();
    }).then(function (themeData) {
      localStorage.setItem("grimoire", JSON.stringify(themeData.Response.themeCollection));
      return themeData.Response.themeCollection;
    }).catch(function (error) {
      console.error(error);
    });
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('random',['exports', 'progressbar.js', 'data-service'], function (exports, _progressbar, _dataService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.RandomCardView = undefined;

  var _progressbar2 = _interopRequireDefault(_progressbar);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var RandomCardView = exports.RandomCardView = function () {
    function RandomCardView() {
      _classCallCheck(this, RandomCardView);

      this.themes = null;
      this.card = null;
      this.cardName = '';
      this.pageName = '';
      this.themeName = '';
      this.bar = null;
      this.color = 'footer-color-1';
      this.shareHref = encodeURIComponent(window.location.href);
      this.timerPlaying = true;
    }

    RandomCardView.prototype.attached = function attached() {
      var _this = this;

      if (localStorage.rdgTimerPlaying) {
        this.timerPlaying = localStorage.rdgTimerPlaying == "true";
      }

      (0, _dataService.fetchGrimoire)().then(function (themeData) {
        _this.themes = themeData;
        _this.updateCard();
      });
    };

    RandomCardView.prototype.updateCard = function updateCard() {
      var _this2 = this;

      document.getElementById('grimoire-card').scrollIntoView();
      var theme = this.themes[Math.floor(Math.random() * this.themes.length)];
      this.themeName = theme.themeName;
      var page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection.length)];
      this.pageName = page.pageName;
      this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection.length)];
      this.cardName = this.card.cardName;

      document.getElementById('body').className = 'color-' + this.card.rarity;
      this.color = 'footer-color-' + this.card.rarity;

      var introLength = this.card.cardIntro === undefined || this.card.cardIntro === null ? 0 : this.card.cardIntro.split(" ").length;
      var secs = Math.max((this.card.cardDescription.split(" ").length + introLength) / 200 * 60, 10);

      if (this.bar !== null) {
        this.bar.destroy();
      }

      var colorTo = '#2196F3';
      if (this.card.rarity === 2) {
        colorTo = '#673AB7';
      }
      if (this.card.rarity === 3) {
        colorTo = '#FF9800';
      }

      this.bar = new _progressbar2.default.Line(document.getElementById('progressBar'), {
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
        return '' + this.cardName;
      }
    }, {
      key: 'categoryTitle',
      get: function get() {
        return this.themeName + ' :: ' + this.pageName;
      }
    }]);

    return RandomCardView;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <router-view></router-view>\r\n</template>\r\n"; });
define('text!card-detail.html', ['module'], function(module) { module.exports = "<template bindable=\"headingText, headingCategory, imageSrc, intro, description\">\r\n  <div id='grimoire-card' class=\"content\">   \r\n    <div class=\"row col\">\r\n      <h2 innerhtml='${headingCategory}'></h2>\r\n      <h1 innerhtml='${headingText}'></h1>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col grim-img\">\r\n        <img src='${imageSrc}' alt=\"grimoire card\" />\r\n      </div>\r\n      <div class=\"col grim-text\">\r\n        <h4 if.bind=\"intro\" innerhtml='${intro}'></h4>\r\n        <p innerhtml='${description}'></p>\r\n      </div>\r\n    </div>\r\n  </div>    \r\n</template>"; });
define('text!card.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./card-detail.html\"></require>\r\n  <section class=\"au-animate\">\r\n    <card-detail heading-text=\"${title}\" heading-category=\"${categoryTitle}\" \r\n      image-src=\"https://www.bungie.net${card.highResolution.image.sheetPath}\" \r\n      description=\"${card.cardDescription}\" \r\n      intro=\"${card.cardIntro}\"></card-detail>\r\n    <footer id=\"footer\" class=\"${color}\" style=\"padding-left: 0;\">      \r\n      <div class=\"clear text-pad\">\r\n        <a class=\"grey-text text-lighten-4 right\" route-href=\"route: random;\"><span class=\"octicon octicon-sync\"></span> <span> show random card</span></a>\r\n      </div>      \r\n      <div class=\"clear grey-text text-lighten-4 right text-pad extra-pad\">\r\n        <span>share on</span>\r\n        <a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=Grimoire Card :: ${encodedCardName}&via=davetimmins&url=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"Twitter\" src=\"images/twitter-bird.svg\" /></a>\r\n        <span>, </span>\r\n        <a target=\"_blank\" href=\"https://facebook.com/sharer.php?u=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"facebook\" src=\"images/FB-f-Logo__white_50.png\" /></a>\r\n        <span> or </span>\r\n        <a target=\"_blank\" href=\"https://www.reddit.com/submit?title=Destiny Grimoire Card :: ${encodedCardName}&url=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"Reddit\" src=\"images/reddit-alien.svg\" /></a>\r\n      </div>      \r\n      <div class=\"footer-copyright clear text-pad\">        \r\n          <a class=\"grey-text text-lighten-4\" href=\"http://davetimmins.com\">&copy; 2016 dave timmins</a>\r\n          <a class=\"grey-text text-lighten-4 right\" href=\"https://github.com/davetimmins/random-destiny-grimoire\"><span class=\"octicon octicon-logo-github\"></span></a>      \r\n      </div>\r\n    </footer>          \r\n  </section>\r\n</template>\r\n"; });
define('text!random.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./card-detail.html\"></require>\r\n  <section class=\"au-animate\">\r\n    <div id=\"progressBar\"></div>\r\n    <div class=\"timerControl\" click.trigger=\"toggleTimer()\">\r\n      <span class=\"mega-octicon octicon-clock\"></span>\r\n      <span id=\"timerStop\" class=\"mega-octicon octicon-circle-slash\"></span>\r\n    </div>\r\n    <card-detail heading-text=\"${title}\" heading-category=\"${categoryTitle}\" \r\n      image-src=\"https://www.bungie.net${card.highResolution.image.sheetPath}\" \r\n      description=\"${card.cardDescription}\" \r\n      intro=\"${card.cardIntro}\"></card-detail>\r\n    <footer id=\"footer\" class=\"${color}\" style=\"padding-left: 0;\">      \r\n      <div class=\"clear text-pad\">\r\n        <a class=\"grey-text text-lighten-4 right\" click.trigger=\"updateCard()\"><span class=\"octicon octicon-sync\"></span> new random card</span></a>\r\n      </div>\r\n      <div class=\"clear text-pad\">\r\n        <a class=\"grey-text text-lighten-4 right\" if.bind=\"card\" route-href=\"route: card; params.bind: {id:card.cardId}\"><span class=\"octicon octicon-link\"></span><span> permalink</span></a>\r\n      </div>\r\n      <div class=\"clear grey-text text-lighten-4 right text-pad extra-pad\">\r\n        <span>share on</span>\r\n        <a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=Grimoire Card :: ${encodedCardName}&via=davetimmins&url=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"Twitter\" src=\"images/twitter-bird.svg\" /></a>\r\n        <span>, </span>\r\n        <a target=\"_blank\" href=\"https://facebook.com/sharer.php?u=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"facebook\" src=\"images/FB-f-Logo__white_50.png\" /></a>\r\n        <span> or </span>\r\n        <a target=\"_blank\" href=\"https://www.reddit.com/submit?title=Destiny Grimoire Card :: ${encodedCardName}&url=${shareHref}\"><img width=\"25\" height=\"25\" alt=\"Reddit\" src=\"images/reddit-alien.svg\" /></a>\r\n      </div>      \r\n      <div class=\"footer-copyright clear text-pad\">        \r\n          <a class=\"grey-text text-lighten-4\" href=\"http://davetimmins.com\">&copy; 2016 dave timmins</a>\r\n          <a class=\"grey-text text-lighten-4 right\" href=\"https://github.com/davetimmins/random-destiny-grimoire\"><span class=\"octicon octicon-logo-github\"></span></a>      \r\n      </div>\r\n    </footer>    \r\n  </section>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map