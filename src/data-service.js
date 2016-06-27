import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';

export function fetchGrimoire() {

  if (localStorage.grimoire) {

    return new Promise(function(resolve, reject) {
        resolve(JSON.parse(localStorage.getItem("grimoire")))
      });
  }

  let client = new HttpClient();
  return client
      .fetch('data/grimoire.json')
      .then(response => response.json())
      .then(themeData => {
        localStorage.setItem("grimoire", JSON.stringify(themeData.Response.themeCollection));
        return themeData.Response.themeCollection;
      })
      .catch(error => {
        console.error(error);
      });
};