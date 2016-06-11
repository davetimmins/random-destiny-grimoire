//import {computedFrom} from 'aurelia-framework';
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
  progressTimeout = null;

  constructor(httpClient) {
    this.http = httpClient;
  }

  attached() {

    this.http
      .fetch('data/grimoire.json')
      .then(response => response.json())
      .then(themeData => {
        this.themes = themeData.Response.themeCollection;
        this.updateCard();
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCard() {

    $('#progressBar').hide();
    const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    this.themeName = theme.themeName;
    const page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection
      .length)];
    this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection
      .length)];
    this.cardName = this.card.cardName;

    document.getElementById('body').className = 'color-' + this.card.rarity;

    var secs = (this.card.cardDescription.split(" ").length / 220) * 60;
    this.progress(secs, secs, $('#progressBar'), true)
  }

  progress(timeleft, timetotal, $element, cancel) {

    if (cancel === true && this.progressTimeout) {
      $('#progressBar').hide();
      clearTimeout(this.progressTimeout);
    }

    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find('div').animate({
      width: progressBarWidth
    }, timeleft === timetotal ? 0 : 200, 'linear');

    if (timeleft > -1) {
      $('#progressBar').show();
      var self = this;
      this.progressTimeout = setTimeout(function() {
        self.progress(timeleft - 0.2, timetotal, $element, false);
      }, 200);
    } else {
      $('#progressBar').hide();
      this.updateCard();
    }
  };

  get title() {
    return `${this.themeName} :: ${this.cardName}`;
  }
}
