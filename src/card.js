import {
  inject
}
from 'aurelia-framework';
import {
  HttpClient, json
}
from 'aurelia-fetch-client';

@
inject(HttpClient)
export class CardView {

  themes = null;
  card = null;
  cardName = '';
  themeName = '';
  http = null;
  id = '';
  color = '#c3c3c3';
  shareHref = '';
  encodedCardName = '';

  constructor(httpClient) {
    this.http = httpClient;
  }

  activate(params) {
    this.id = params.id;
  }

  attached() {
    var self = this;
    this.http
      .fetch('data/grimoire.json')
      .then(response => response.json())
      .then(themeData => {
        //this.themes = themeData.Response.themeCollection;

        for (var i = 0; i < themeData.Response.themeCollection.length; i++) {
          var theme = themeData.Response.themeCollection[i];

          for (var j = 0; j < theme.pageCollection.length; j++) {
            var page = theme.pageCollection[j];


            for (var k = 0; k < page.cardCollection.length; k++) {
              var card = page.cardCollection[k];

              if (card.cardId == self.id) {
                self.shareHref = encodeURIComponent(window.location.href);
                self.encodedCardName = encodeURIComponent(card.cardName);
                self.themeName = theme.themeName;
                self.card = card;
                self.cardName = card.cardName;
                document.getElementById('body').className = 'color-' + card
                  .rarity;
                if (card.rarity === 1) {
                  self.color = '#2196F3';
                }
                if (card.rarity === 2) {
                  self.color = '#673AB7';
                }
                if (card.rarity === 3) {
                  self.color = '#FF9800';
                }
                break;
              }
            }
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  get title() {
    return `${this.themeName} :: ${this.cardName}`;
  }
}
