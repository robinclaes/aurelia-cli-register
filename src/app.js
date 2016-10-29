export class App {
  constructor(){
  }

  configureRouter(config, router) {
    config.title = 'Wolf Espressobar';
    config.map([
        { route: ['','table-overview'], name: 'table-overview', moduleId: './table-overview', nav: true, title:'Table Overview' },
        { route: ['table-details'], name: 'table-details', moduleId: './table-details', nav: true, title:'Table Details' },
        { route: ['new-order'], name: 'new-order', moduleId: './new-order', nav: true, title:'New Order' }
    ]);

    this.router = router;
  }
}
