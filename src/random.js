import ProgressBar from 'progressbar.js';
import { fetchGrimoire } from './data-service';

export class RandomCardView {

  constructor() {
    this.themes = null;
    this.card = null;
    this.cardName = '';
    this.themeName = '';    
    this.bar = null;
    this.color = '#c3c3c3';
    this.shareHref = encodeURIComponent(window.location.href);
    this.timerPlaying = true;
  }

  attached() {

    if (localStorage.rdgTimerPlaying) {
      this.timerPlaying = (localStorage.rdgTimerPlaying == "true");
    }

    var storedPlaying = localStorage.getItem("rdgTimerPlaying");

    fetchGrimoire().then(themeData => {
        this.themes = themeData;
        this.updateCard();
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

    var secs = Math.max((this.card.cardDescription.split(" ").length / 200) *
      60, 10);

    if (this.bar !== null) {
      this.bar.destroy();
    }

    var colorTo = '#2196F3';
    if (this.card.rarity === 1) {
      this.color = '#2196F3';
    }
    if (this.card.rarity === 2) {
      this.color = '#673AB7';
      colorTo = '#673AB7';
    }
    if (this.card.rarity === 3) {
      this.color = '#FF9800';
      colorTo = '#FF9800';
    }

    this.bar = new ProgressBar.Line(document.getElementById('progressBar'), {
      duration: secs * 1000,
      color: '#f44336',
      trailColor: '#e9e9e9',
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

    var timerStop = document.querySelector("#timerStop");
    if (this.timerPlaying) {
      timerStop.classList.add("hidden");
      const self = this;
      this.bar.animate(0.0, {}, function() {
        self.updateCard()
      });
    } else {
      timerStop.classList.remove("hidden");
    }
  }

  toggleTimer() {

    this.timerPlaying = !this.timerPlaying;
    localStorage.setItem("rdgTimerPlaying", this.timerPlaying);

    var timerStop = document.querySelector("#timerStop");
    if (this.timerPlaying === true) {

      timerStop.classList.add("hidden");

      if (this.bar !== null) {
        const self = this;
        this.bar.animate(0.0, {
          duration: this.bar._opts.duration * this.bar.value()
        }, function() {
          self.updateCard();
        });
      }
    } else {

      timerStop.classList.remove("hidden");

      if (this.bar !== null) {
        this.bar.stop();
      }
    }
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
