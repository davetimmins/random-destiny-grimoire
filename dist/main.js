'use strict';

System.register(['fetch'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_fetch) {}],
    execute: function () {
      function configure(aurelia) {
        aurelia.use.standardConfiguration().developmentLogging().plugin('aurelia-materialize-bridge', function (bridge) {
          return bridge.useColors().useFooter();
        });


        aurelia.start().then(function () {
          return aurelia.setRoot();
        });
      }

      _export('configure', configure);
    }
  };
});
//# sourceMappingURL=main.js.map
