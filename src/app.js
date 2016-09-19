import firebase from 'firebase';

export class App {
  constructor(){
    var firebase = require('firebase');
    var config = {
      apiKey: "AIzaSyCyLGcP7x7Jo3rEQFO1vzDLiknfrm_t_CU",
      authDomain: "wolf-espressobar.firebaseapp.com",
      databaseURL: "https://wolf-espressobar.firebaseio.com",
      storageBucket: "wolf-espressobar.appspot.com",
    };
    firebase.initializeApp(config);
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
