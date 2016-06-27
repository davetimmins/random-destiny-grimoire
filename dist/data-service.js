'use strict';

System.register(['aurelia-fetch-client', 'fetch'], function (_export, _context) {
  "use strict";

  var HttpClient;
  return {
    setters: [function (_aureliaFetchClient) {
      HttpClient = _aureliaFetchClient.HttpClient;
    }, function (_fetch) {}],
    execute: function () {
      function fetchGrimoire() {

        if (localStorage.grimoire) {

          return new Promise(function (resolve, reject) {
            resolve(JSON.parse(localStorage.getItem("grimoire")));
          });
        }

        var client = new HttpClient();
        return client.fetch('data/grimoire.json').then(function (response) {
          return response.json();
        }).then(function (themeData) {
          localStorage.setItem("grimoire", JSON.stringify(themeData.Response.themeCollection));
          return themeData.Response.themeCollection;
        }).catch(function (error) {
          console.error(error);
        });
      }
      _export('fetchGrimoire', fetchGrimoire);

      ;
    }
  };
});
//# sourceMappingURL=data-service.js.map
