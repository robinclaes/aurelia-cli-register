import environment from './environment';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
  .standardConfiguration()
  .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  firebase.initializeApp({
    apiKey: "AIzaSyCyLGcP7x7Jo3rEQFO1vzDLiknfrm_t_CU",
    authDomain: "wolf-espressobar.firebaseapp.com",
    databaseURL: "https://wolf-espressobar.firebaseio.com",
    storageBucket: "wolf-espressobar.appspot.com",
  });

  aurelia.start().then(() => aurelia.setRoot());
}
