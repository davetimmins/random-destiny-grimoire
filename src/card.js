import { fetchGrimoire } from 'data-service';

export class CardView {

  constructor() {
    this.card = null;
    this.cardName = '';
    this.pageName = '';
    this.themeName = '';  
    this.color = 'footer-color-1';
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
              this.pageName = page.pageName;
              document.getElementById('body').className = 'color-' + card
                .rarity;  
              this.color = 'footer-color-' + card.rarity;       
              break;
            }
          }
        }
      }
    });
  }

  get title() {
    return `${this.cardName}`;
  }

  get categoryTitle() {
    return `${this.themeName} :: ${this.pageName}`;
  }
}
