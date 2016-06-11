export class App {

  configureRouter(config, router) {
    config.map([{
      route: ['', 'random'],
      name: 'random',
      moduleId: './random',
      nav: true,
      title: 'Random Grimoire'
    }, {
      route: 'card/:id',
      name: 'card',
      moduleId: './card',
      nav: false,
      title: 'Grimoire Card'
    }]);

    this.router = router;
  }
}
