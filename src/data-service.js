import { HttpClient } from 'aurelia-fetch-client';

export function fetchGrimoire() {

  if (localStorage.grimoireVersion && localStorage.grimoireVersion === "9" && localStorage.grimoire) {

    return new Promise(function(resolve, reject) {
      resolve(JSON.parse(localStorage.grimoire))
    });
  }

  let client = new HttpClient();
  return client
      .fetch('data/grimoire.json')
      .then(response => response.json())
      .then(themeData => {
        localStorage.setItem("grimoireVersion", "9"); // 801101
        localStorage.setItem("grimoire", JSON.stringify(themeData.Response.themeCollection));
        return themeData.Response.themeCollection;
      })
      .catch(error => {
        console.error(error);
      });
};