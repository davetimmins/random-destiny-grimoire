define("app",["exports"],function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});t.App=function(){function t(){e(this,t)}return t.prototype.configureRouter=function(t,e){t.map([{route:["","random"],name:"random",moduleId:"./random",nav:!0,title:"Random Grimoire"},{route:"card/:id",name:"card",moduleId:"./card",nav:!1,title:"Grimoire Card"}]),this.router=e},t}()}),define("card",["exports","data-service"],function(t,e){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.CardView=void 0;var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,r,i){return r&&t(e.prototype,r),i&&t(e,i),e}}();t.CardView=function(){function t(){r(this,t),this.card=null,this.cardName="",this.pageName="",this.themeName="",this.color="footer-color-1",this.shareHref="",this.encodedCardName=""}return t.prototype.activate=function(t){this.id=t.id},t.prototype.attached=function(){var t=this;(0,e.fetchGrimoire)().then(function(e){for(var r=0;r<e.length;r++)for(var i=e[r],n=0;n<i.pageCollection.length;n++)for(var a=i.pageCollection[n],o=0;o<a.cardCollection.length;o++){var c=a.cardCollection[o];if(c.cardId==t.id){t.shareHref=encodeURIComponent(window.location.href),t.encodedCardName=encodeURIComponent(c.cardName),t.themeName=i.themeName,t.card=c,t.cardName=c.cardName,t.pageName=a.pageName,document.getElementById("body").className="color-"+c.rarity,t.color="footer-color-"+c.rarity,document.getElementById("grimoire-card").scrollIntoView();break}}})},i(t,[{key:"title",get:function(){return""+this.cardName}},{key:"categoryTitle",get:function(){return this.themeName+" :: "+this.pageName}}]),t}()}),define("data-service",["exports","aurelia-fetch-client"],function(t,e){"use strict";function r(){if(localStorage.grimoireVersion&&"8"===localStorage.grimoireVersion&&localStorage.grimoire)return new Promise(function(t,e){t(JSON.parse(localStorage.grimoire))});var t=new e.HttpClient;return t.fetch("data/grimoire.json").then(function(t){return t.json()}).then(function(t){return localStorage.setItem("grimoireVersion","8"),localStorage.setItem("grimoire",JSON.stringify(t.Response.themeCollection)),t.Response.themeCollection}).catch(function(t){console.error(t)})}Object.defineProperty(t,"__esModule",{value:!0}),t.fetchGrimoire=r}),define("environment",["exports"],function(t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={debug:!1,testing:!1}}),define("main",["exports","./environment"],function(t,e){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t){t.use.standardConfiguration().feature("resources"),n.default.debug&&t.use.developmentLogging(),n.default.testing&&t.use.plugin("aurelia-testing"),t.start().then(function(){return t.setRoot()})}Object.defineProperty(t,"__esModule",{value:!0}),t.configure=i;var n=r(e);Promise.config({warnings:{wForgottenReturn:!1}});var a="davetimmins.com";a==window.location.host&&"https:"!=window.location.protocol&&(window.location.protocol="https")}),define("random",["exports","progressbar.js","data-service"],function(t,e,r){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.RandomCardView=void 0;var a=i(e),o=function(){function t(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,r,i){return r&&t(e.prototype,r),i&&t(e,i),e}}();t.RandomCardView=function(){function t(){n(this,t),this.themes=null,this.card=null,this.cardName="",this.pageName="",this.themeName="",this.bar=null,this.color="footer-color-1",this.shareHref=encodeURIComponent(window.location.href),this.timerPlaying=!0}return t.prototype.attached=function(){var t=this;localStorage.rdgTimerPlaying&&(this.timerPlaying="true"==localStorage.rdgTimerPlaying),(0,r.fetchGrimoire)().then(function(e){t.themes=e,t.updateCard()})},t.prototype.updateCard=function(){var t=this;document.getElementById("grimoire-card").scrollIntoView();var e=this.themes[Math.floor(Math.random()*this.themes.length)];this.themeName=e.themeName;var r=e.pageCollection[Math.floor(Math.random()*e.pageCollection.length)];this.pageName=r.pageName,this.card=r.cardCollection[Math.floor(Math.random()*r.cardCollection.length)],this.cardName=this.card.cardName,document.getElementById("body").className="color-"+this.card.rarity,this.color="footer-color-"+this.card.rarity;var i=void 0===this.card.cardIntro||null===this.card.cardIntro?0:this.card.cardIntro.split(" ").length,n=Math.max((this.card.cardDescription.split(" ").length+i)/200*60,10);null!==this.bar&&this.bar.destroy();var o="#2196F3";2===this.card.rarity&&(o="#673AB7"),3===this.card.rarity&&(o="#FF9800"),this.bar=new a.default.Line(document.getElementById("progressBar"),{duration:1e3*n,color:"#f44336",trailColor:"#e9e9e9",svgStyle:{width:"100%",height:"100%"},from:{color:"#f44336"},to:{color:o},step:function(t,e){e.path.setAttribute("stroke",t.color)}}),this.bar.set(1);var c=document.querySelector("#timerStop");this.timerPlaying?!function(){c.classList.add("hidden");var e=t;t.bar.animate(0,{},function(){e.updateCard()})}():c.classList.remove("hidden")},t.prototype.toggleTimer=function(){var t=this;this.timerPlaying=!this.timerPlaying,localStorage.setItem("rdgTimerPlaying",this.timerPlaying);var e=document.querySelector("#timerStop");this.timerPlaying===!0?(e.classList.add("hidden"),null!==this.bar&&!function(){var e=t;t.bar.animate(0,{duration:t.bar._opts.duration*t.bar.value()},function(){e.updateCard()})}()):(e.classList.remove("hidden"),null!==this.bar&&this.bar.stop())},t.prototype.detached=function(){null!==this.bar&&this.bar.destroy()},o(t,[{key:"title",get:function(){return""+this.cardName}},{key:"categoryTitle",get:function(){return this.themeName+" :: "+this.pageName}}]),t}()}),define("resources/index",["exports"],function(t){"use strict";function e(t){}Object.defineProperty(t,"__esModule",{value:!0}),t.configure=e}),define("text!app.html",["module"],function(t){t.exports="<template>\r\n  <router-view></router-view>\r\n</template>\r\n"}),define("text!card-detail.html",["module"],function(t){t.exports='<template bindable="headingText, headingCategory, imageSrc, intro, introAttribution, description">\r\n  <div id=\'grimoire-card\' class="content">   \r\n    <div class="row col">\r\n      <h2 innerhtml=\'${headingCategory}\'></h2>\r\n      <h1 innerhtml=\'${headingText}\'></h1>\r\n    </div>\r\n    <div class="row">\r\n      <div class="col grim-img">\r\n        <img src=\'${imageSrc}\' alt="grimoire card" />\r\n      </div>\r\n      <div class="col grim-text">\r\n        <h4 if.bind="intro" innerhtml=\'${intro}\'></h4>\r\n        <h5 if.bind="introAttribution" innerhtml=\'${introAttribution}\'></h5>\r\n        <p if.bind="description" innerhtml=\'${description}\'></p>\r\n      </div>\r\n    </div>\r\n  </div>    \r\n</template>'}),define("text!card.html",["module"],function(t){t.exports='<template>\r\n  <require from="./card-detail.html"></require>\r\n  <section class="au-animate">\r\n    <card-detail heading-text="${title}" heading-category="${categoryTitle}" \r\n      image-src="https://www.bungie.net${card.highResolution.image.sheetPath}" \r\n      description="${card.cardDescription}" \r\n      intro="${card.cardIntro}" \r\n      intro-attribution="${card.cardIntroAttribution}"></card-detail>\r\n    <footer id="footer" class="${color}" style="padding-left: 0;">      \r\n      <div class="clear text-pad">\r\n        <a class="grey-text text-lighten-4 right" route-href="route: random;"><span class="octicon octicon-sync"></span> <span> show random card</span></a>\r\n      </div>      \r\n      <div class="clear grey-text text-lighten-4 right text-pad extra-pad">\r\n        <span>share on</span>\r\n        <a target="_blank" href="https://twitter.com/intent/tweet?text=Grimoire Card :: ${encodedCardName}&via=davetimmins&url=${shareHref}"><img width="25" height="25" alt="Twitter" src="images/twitter-bird.svg" /></a>\r\n        <span>, </span>\r\n        <a target="_blank" href="https://facebook.com/sharer.php?u=${shareHref}"><img width="25" height="25" alt="facebook" src="images/FB-f-Logo__white_50.png" /></a>\r\n        <span> or </span>\r\n        <a target="_blank" href="https://www.reddit.com/submit?title=Destiny Grimoire Card :: ${encodedCardName}&url=${shareHref}"><img width="25" height="25" alt="Reddit" src="images/reddit-alien.svg" /></a>\r\n      </div>      \r\n      <div class="footer-copyright clear text-pad">        \r\n          <a class="grey-text text-lighten-4" href="http://davetimmins.com">&copy; 2016 dave timmins</a>\r\n          <a class="grey-text text-lighten-4 right" href="https://github.com/davetimmins/random-destiny-grimoire"><span class="octicon octicon-logo-github"></span></a>      \r\n      </div>\r\n    </footer>          \r\n  </section>\r\n</template>\r\n'}),define("text!random.html",["module"],function(t){t.exports='<template>\r\n  <require from="./card-detail.html"></require>\r\n  <section class="au-animate">\r\n    <div id="progressBar"></div>\r\n    <div class="timerControl" click.trigger="toggleTimer()">\r\n      <span class="mega-octicon octicon-clock"></span>\r\n      <span id="timerStop" class="mega-octicon octicon-circle-slash"></span>\r\n    </div>\r\n    <card-detail heading-text="${title}" heading-category="${categoryTitle}" \r\n      image-src="https://www.bungie.net${card.highResolution.image.sheetPath}" \r\n      description="${card.cardDescription}" \r\n      intro="${card.cardIntro}" \r\n      intro-attribution="${card.cardIntroAttribution}"></card-detail>\r\n    <footer id="footer" class="${color}" style="padding-left: 0;">      \r\n      <div class="clear text-pad">\r\n        <a class="grey-text text-lighten-4 right" click.trigger="updateCard()"><span class="octicon octicon-sync"></span> new random card</span></a>\r\n      </div>\r\n      <div class="clear text-pad">\r\n        <a class="grey-text text-lighten-4 right" if.bind="card" route-href="route: card; params.bind: {id:card.cardId}"><span class="octicon octicon-bookmark"></span><span> permalink</span></a>\r\n      </div>\r\n      <div class="clear grey-text text-lighten-4 right text-pad extra-pad">\r\n        <span>share on</span>\r\n        <a target="_blank" href="https://twitter.com/intent/tweet?text=Random Destiny Grimoire&via=davetimmins&url=${shareHref}"><img width="25" height="25" alt="Twitter" src="images/twitter-bird.svg" /></a>\r\n        <span>, </span>\r\n        <a target="_blank" href="https://facebook.com/sharer.php?u=${shareHref}"><img width="25" height="25" alt="facebook" src="images/FB-f-Logo__white_50.png" /></a>\r\n        <span> or </span>\r\n        <a target="_blank" href="https://www.reddit.com/submit?title=Random Destiny Grimoire&url=${shareHref}"><img width="25" height="25" alt="Reddit" src="images/reddit-alien.svg" /></a>\r\n      </div>      \r\n      <div class="footer-copyright clear text-pad">        \r\n          <a class="grey-text text-lighten-4" href="http://davetimmins.com">&copy; 2016 dave timmins</a>\r\n          <a class="grey-text text-lighten-4 right" href="https://github.com/davetimmins/random-destiny-grimoire"><span class="octicon octicon-logo-github"></span></a>      \r\n      </div>\r\n    </footer>    \r\n  </section>\r\n</template>'});