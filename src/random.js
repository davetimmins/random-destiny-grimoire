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
  color = '#2196F3';

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

    window.scrollTo(0, 0);
    const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    this.themeName = theme.themeName;
    const page = theme.pageCollection[Math.floor(Math.random() * theme.pageCollection
      .length)];
    this.card = page.cardCollection[Math.floor(Math.random() * page.cardCollection
      .length)];
    this.cardName = this.card.cardName;

    document.getElementById('body').className = 'color-' + this.card.rarity;

    var secs = Math.max((this.card.cardDescription.split(" ").length / 220) *
      60, 8);

    if (this.bar !== null) {
      this.bar.destroy();
    }

    var colorTo = '#2196F3';
    if (this.card.rarity === 1) {
      this.color = '#2196F3';
    }
    if (this.card.rarity === 2) {
      this.color = '#4A148C';
      colorTo = '#4A148C';
    }
    if (this.card.rarity === 3) {
      this.color = '#FF6F00';
      colorTo = '#FF6F00';
    }

    this.bar = new ProgressBar.Line(document.getElementById('progressBar'), {
      duration: secs * 1000,
      color: '#f44336',
      trailColor: '#EEEEEE',
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
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
      }
    });
    this.bar.set(1.0);
    const self = this;
    this.bar.animate(0.0, {}, function() {
      self.updateCard()
    }); // Number from 0.0 to 1.0
  }

  detached() {
    if (this.bar !== null) {
      this.bar.destroy();
    }
  }

  get title() {
    return `${this.themeName} :: ${this.cardName}`;
  }
}
