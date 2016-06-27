import { fetchGrimoire } from 'data-service';

export class CardView {

  constructor() {
    this.card = null;
    this.cardName = '';
    this.themeName = '';  
    this.color = '#c3c3c3';
    this.shareHref = '';
    this.encodedCardName = '';
  }

  activate(params) {
    this.id = params.id;
  }

  attached() {

    fetchGrimoire().then(themeData => {            

      for (var i = 0; i < themeData.length; i++) {
        var theme = themeData[i];

        for (var j = 0; j < theme.pageCollection.length; j++) {
          var page = theme.pageCollection[j];

          for (var k = 0; k < page.cardCollection.length; k++) {
            var card = page.cardCollection[k];

            if (card.cardId == this.id) {
              this.shareHref = encodeURIComponent(window.location.href);
              this.encodedCardName = encodeURIComponent(card.cardName);
              this.themeName = theme.themeName;
              this.card = card;
              this.cardName = card.cardName;
              document.getElementById('body').className = 'color-' + card
                .rarity;
              if (card.rarity === 1) {
                this.color = '#2196F3';
              }
              if (card.rarity === 2) {
                this.color = '#673AB7';
              }
              if (card.rarity === 3) {
                this.color = '#FF9800';
              }
              break;
            }
          }
        }
      }
    });
  }

  get title() {
    return `${this.themeName} :: ${this.cardName}`;
  }
}
