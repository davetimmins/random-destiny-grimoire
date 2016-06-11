import ProgressBar from 'progressbar.js';
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
export class RandomCardView {

  themes = null;
  card = null;
  cardName = '';
  themeName = '';
  http = null;
  bar = null;

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

    const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    this.themeName = theme.themeName;
    const page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection
      .length)];
    this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection
      .length)];
    this.cardName = this.card.cardName;

    document.getElementById('body').className = 'color-' + this.card.rarity;

    var secs = (this.card.cardDescription.split(" ").length / 220) * 60;

    if (this.bar !== null) {
      this.bar.destroy();
    }
    this.bar = new ProgressBar.Line(document.getElementById('progressBar'), {
      duration: secs * 1000,
      color: '#e57373',
      trailColor: '#1565C0',
      svgStyle: {
        width: '100%',
        height: '100%'
      },
      from: {
        color: '#f44336'
      },
      to: {
        color: '#2196F3'
      },
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
      }
    });
    this.bar.set(1.0);
    this.bar.animate(0.0); // Number from 0.0 to 1.0

    const self = this;
    setTimeout(function() {
      self.updateCard();
    }, secs * 1000);
  }

  get title() {
    return `${this.themeName} :: ${this.cardName}`;
  }
}
