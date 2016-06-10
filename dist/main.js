'use strict';

System.register(['fetch'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_fetch) {}],
    execute: function () {
      function configure(aurelia) {
        aurelia.use.standardConfiguration().developmentLogging();

        aurelia.start().then(function () {
          return aurelia.setRoot();
        });
      }

      _export('configure', configure);
    }
  };
});
//# sourceMappingURL=main.js.map
