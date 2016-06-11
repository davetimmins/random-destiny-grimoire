'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var App;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('App', App = function () {
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
      }());

      _export('App', App);
    }
  };
});
//# sourceMappingURL=app.js.map
