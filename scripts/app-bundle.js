define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Wolf Espressobar';
      config.map([{ route: ['', 'table-overview'], name: 'table-overview', moduleId: './table-overview', nav: true, title: 'Table Overview' }, { route: ['table-details'], name: 'table-details', moduleId: './table-details', nav: true, title: 'Table Details' }, { route: ['new-order'], name: 'new-order', moduleId: './new-order', nav: true, title: 'New Order' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    firebase.initializeApp({
      apiKey: "AIzaSyCyLGcP7x7Jo3rEQFO1vzDLiknfrm_t_CU",
      authDomain: "wolf-espressobar.firebaseapp.com",
      databaseURL: "https://wolf-espressobar.firebaseio.com",
      storageBucket: "wolf-espressobar.appspot.com"
    });

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('new-order',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NewOrder = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var NewOrder = exports.NewOrder = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function NewOrder(router) {
      _classCallCheck(this, NewOrder);

      this.tableId = null;
      this.products = null;
      this.router = null;
      this.order = {};

      this.router = router;
      this.order.products = [];
    }

    NewOrder.prototype.activate = function activate(params) {
      var _this = this;

      params.id ? this.tableId = params.id : this.router.navigateToRoute("table-overview");
      var categoriesRef = firebase.database().ref('categories');
      categoriesRef.once('value', function (snapshot) {
        _this.categories = snapshot.val();
      });
    };

    NewOrder.prototype.back = function back() {
      this.router.navigateToRoute("table-details", { id: this.tableId });
    };

    NewOrder.prototype.addProduct = function addProduct(product) {
      var pIndex = this.order.products.indexOf(product);
      if (pIndex > -1) {
        this.order.products[pIndex].amount++;
      } else {
        product.amount = 1;
        this.order.products.push(product);
      }
    };

    return NewOrder;
  }()) || _class);
});
define('table-details',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TableDetails = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TableDetails = exports.TableDetails = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function TableDetails(router) {
      _classCallCheck(this, TableDetails);

      this.heading = 'Order';
      this.bill = null;
      this.orders = null;
      this.router = null;
      this.tableId = null;

      this.router = router;
    }

    TableDetails.prototype.activate = function activate(params) {
      var _this = this;

      this.tableId = params.id;
      var billRef = firebase.database().ref('bills/' + params.id);
      billRef.orderByValue().on('value', function (snapshot) {
        if (snapshot.exists()) {
          _this.bill = snapshot.val();

          _this.bill.totalAmount = 0;

          for (var key in _this.bill.orders) {
            for (var _iterator = _this.bill.orders[key].products, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
              var _ref;

              if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
              } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
              }

              var product = _ref;

              _this.bill.totalAmount += product.price * product.amount;
            }
          }
        }
      });
    };

    TableDetails.prototype.back = function back() {
      this.router.navigateToRoute("table-overview");
    };

    TableDetails.prototype.newOrder = function newOrder() {
      this.router.navigateToRoute("new-order", { id: this.tableId });
    };

    return TableDetails;
  }()) || _class);
});
define('table-overview',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TableOverview = exports.TableOverview = function () {
    function TableOverview() {
      _classCallCheck(this, TableOverview);

      this.tables = [];
    }

    TableOverview.prototype.activate = function activate() {
      var _this = this;

      var tables = firebase.database().ref('tables');
      tables.on('value', function (snapshot) {
        _this.tables = snapshot.val();
      });
    };

    return TableOverview;
  }();
});
define('components/bill',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Bill = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var Bill = exports.Bill = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = (_class2 = function () {
    function Bill(router) {
      _classCallCheck(this, Bill);

      _initDefineProp(this, 'bill', _descriptor, this);

      _initDefineProp(this, 'id', _descriptor2, this);

      this.router = router;
    }

    Bill.prototype.removeBill = function removeBill() {
      var billRef = firebase.database().ref('bills/' + this.id);
      billRef.remove();
      this.router.navigateToRoute('table-overview');
    };

    return Bill;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'bill', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'id', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('components/order-details',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.OrderDetails = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor, _descriptor2;

  var OrderDetails = exports.OrderDetails = (_class = function () {
    function OrderDetails() {
      _classCallCheck(this, OrderDetails);

      _initDefineProp(this, 'orderId', _descriptor, this);

      _initDefineProp(this, 'order', _descriptor2, this);
    }

    OrderDetails.prototype.attached = function attached() {
      console.log(this.order);
    };

    OrderDetails.prototype.removeOrder = function removeOrder(orderId) {
      var ref = firebase.database().ref('bills/B1/orders/' + orderId);
      console.log(ref);
      ref.remove();
    };

    return OrderDetails;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'orderId', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'order', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class);
});
define('components/order',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Order = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var Order = exports.Order = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = (_class2 = function () {
    function Order(router) {
      _classCallCheck(this, Order);

      _initDefineProp(this, 'order', _descriptor, this);

      _initDefineProp(this, 'id', _descriptor2, this);

      this.router = null;

      this.router = router;
    }

    Order.prototype.placeOrder = function placeOrder() {
      if (this.id) {
        this.order.time = new Date().toTimeString().split(' ')[0];
        var ordersRef = firebase.database().ref('bills/' + this.id + '/orders');
        ordersRef.push(JSON.parse(JSON.stringify(this.order)));
        this.router.navigateToRoute('table-details', { id: this.id });
      }
    };

    return Order;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'order', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'id', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('components/product',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Product = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var Product = exports.Product = (_class = function Product(router) {
    _classCallCheck(this, Product);

    _initDefineProp(this, 'product', _descriptor, this);

    this.products = null;
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'product', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class);
});
define('components/table-card',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TableCard = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var TableCard = exports.TableCard = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = (_class2 = function () {
    function TableCard(router) {
      _classCallCheck(this, TableCard);

      _initDefineProp(this, 'table', _descriptor, this);

      this.isFree = true;

      this.router = router;
    }

    TableCard.prototype.attached = function attached() {
      var _this = this;

      var billRef = firebase.database().ref('bills/' + this.table.name);
      billRef.once('value', function (snapshot) {
        if (snapshot.exists()) {
          _this.isFree = false;
        }
      });
    };

    TableCard.prototype.openDetails = function openDetails(table) {
      this.router.navigateToRoute("table-details", { id: this.table.name });
    };

    return TableCard;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'table', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./value-converters/euro', './value-converters/object-keys']);
  }
});
define('resources/value-converters/euro',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var EuroValueConverter = exports.EuroValueConverter = function () {
        function EuroValueConverter() {
            _classCallCheck(this, EuroValueConverter);
        }

        EuroValueConverter.prototype.toView = function toView(number) {

            number = number.toFixed(2);
            number = number.replace('.', ',');

            return number;
        };

        return EuroValueConverter;
    }();
});
define('resources/value-converters/object-keys',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ObjectKeysValueConverter = exports.ObjectKeysValueConverter = function () {
    function ObjectKeysValueConverter() {
      _classCallCheck(this, ObjectKeysValueConverter);
    }

    ObjectKeysValueConverter.prototype.toView = function toView(obj) {
      return Reflect.ownKeys(obj);
    };

    return ObjectKeysValueConverter;
  }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./sass/main.css\"></require>\r\n  <div class=\"container-fluid\">\r\n    <router-view></router-view>\r\n  </div>\r\n</template>\r\n"; });
define('text!new-order.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"./components/bill\"></require>\r\n\t<require from=\"./components/order\"></require>\r\n\t<require from=\"./components/product\"></require>\r\n\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-sm-12\">\r\n\t\t\t<a click.trigger=\"back()\"><i class=\"fa fa-arrow-circle-left fa-4x btn-menu\" aria-hidden=\"true\"></i></a>\r\n\r\n\t\t\t<h1>Nieuwe bestelling voor tafel ${tableId}</h1>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-sm-9\">\r\n\t\t\t<button class=\"btn btn-block btn-product\" repeat.for=\"category of categories\" click.trigger=\"activeCategory = category\">${category.name}</button>\r\n\t\t\t<product repeat.for=\"product of activeCategory.products\" product.bind=\"product\" click.trigger=\"addProduct(product)\"></product>\r\n\t\t</div>\r\n\t\t<div class=\"col-sm-3\">\r\n\t\t\t<order order.two-way=\"order\" id.bind=\"tableId\">\r\n\t\t\t\t</new-order>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!sass/main.css', ['module'], function(module) { module.exports = "body {\n  color: #FFF;\n  background-image: url(\"../images/bg.png\");\n  background-size: cover;\n  font-family: 'Comfortaa', cursive; }\n\na {\n  color: rgba(255, 255, 255, 0.4); }\n  a:hover {\n    color: rgba(255, 255, 255, 0.8); }\n\nbutton {\n  border-radius: 0px !important; }\n\n.btn-menu {\n  padding-right: 10px;\n  padding-top: 10px; }\n\n.btn-sm.btn-default {\n  height: 100%; }\n\n.btn-default {\n  background: rgba(0, 0, 0, 0.4);\n  color: #FFF;\n  height: 15vh; }\n  .btn-default:hover {\n    background: rgba(0, 0, 0, 0.8);\n    color: #FFF; }\n\n.btn-table {\n  margin: 20px 0;\n  color: white;\n  border: 1px solid white;\n  height: 19vh;\n  background: rgba(255, 255, 255, 0.4);\n  font-size: 6vh; }\n  .btn-table:hover {\n    background: rgba(255, 255, 255, 0.8); }\n\n.btn-product {\n  margin: 20px 0;\n  color: white;\n  border: 1px solid white;\n  height: 12vh;\n  background: rgba(255, 255, 255, 0.4);\n  font-size: 3vh; }\n  .btn-product:hover {\n    background: rgba(255, 255, 255, 0.8); }\n\n.btn-occupied {\n  background: rgba(133, 171, 203, 0.4); }\n  .btn-occupied:hover {\n    background: rgba(133, 171, 203, 0.8);\n    color: white; }\n\n.panel {\n  margin: 10px 0;\n  background: transparent;\n  border-radius: 0; }\n  .panel .panel-body {\n    background: rgba(255, 255, 255, 0.4);\n    padding: 5px; }\n  .panel .panel-footer {\n    padding: 5px 5px;\n    margin: 0;\n    background: rgba(255, 255, 255, 0.4); }\n\n.table {\n  margin: 0; }\n  .table thead {\n    font-weight: bold; }\n  .table td {\n    background: rgba(255, 255, 255, 0.8);\n    color: #000; }\n"; });
define('text!table-details.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./components/bill\"></require>\r\n  <require from=\"./components/order-details\"></require>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-12\">\r\n      <a click.trigger=\"back()\"><i class=\"fa fa-arrow-circle-left fa-4x btn-menu\" aria-hidden=\"true\"></i></a>\r\n      <a click.trigger=\"newOrder()\"><i class=\"fa fa-plus-circle fa-4x btn-menu\" aria-hidden=\"true\"></i></a>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col-sm-8\">\r\n      <span if.bind=\"!bill.orders\">Geen bestellingen gevonden.</span>\r\n      <order-details if.bind=\"bill.orders\" repeat.for=\"order of bill.orders | objectKeys\" order.bind=\"bill.orders[order]\" order-id.bind=\"order\"></order>\r\n    </div>\r\n    <div class=\"col-sm-4\">\r\n      <bill bill.bind=\"bill\" id.bind=\"tableId\">\r\n      </bill>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!table-overview.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"./components/table-card\"></require>\r\n\r\n    <div class=\"row\">\r\n      <table-card repeat.for=\"table of tables\" table.bind=\"table\"></table-card>\r\n    </div>\r\n</template>\r\n"; });
define('text!components/bill.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n      <h1 class=\"text-center\" if.bind=\"bill\">&euro; ${bill.totalAmount | euro}</h1>\r\n    </div>\r\n    <div class=\"panel-footer\">\r\n        <button class=\"btn btn-block btn-default\" click.trigger=\"checkout()\"><i class=\"fa fa-shopping-basket fa-3x\"></i></button>\r\n        <button class=\"btn btn-block btn-default\" click.trigger=\"removeBill()\"><i class=\"fa fa-trash fa-3x\"></i></button>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/order-details.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n      Order: ${orderId}\r\n      <table class=\"table table-bordered\">\r\n        <thead>\r\n          <tr>\r\n            <td>Product</td>\r\n            <td>Aantal</td>\r\n            <td>Prijs</td>\r\n            <td class=\"text-right\">Totaal</td>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr repeat.for=\"product of order.products\">\r\n            <td>${product.name}</td>\r\n            <td>${product.amount}</td>\r\n            <td>&euro; ${product.price | euro}</td>\r\n            <td class=\"text-right\">&euro; ${product.amount * product.price | euro}</td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div class=\"panel-footer clearfix\" if.bind=\"order.time\">\r\n      <span>Bestelling geplaatst om ${order.time}.</span>\r\n      <div class=\"pull-right\">\r\n        <button class=\"btn btn-sm btn-default\"><i class=\"fa fa-pencil\"></i></button>\r\n        <button class=\"btn btn-sm btn-default\" click.trigger=\"removeOrder(orderId)\"><i class=\"fa fa-trash\"></i></button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/order.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n      <table class=\"table table-striped\">\r\n        <thead>\r\n          <tr>\r\n            <td>Product</td>\r\n            <td>Aantal</td>\r\n            <td>Prijs</td>\r\n            <td>Totaal</td>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr repeat.for=\"product of order.products\">\r\n            <td>${product.name}</td>\r\n            <td>${product.amount}</td>\r\n            <td>&euro; ${product.price.toFixed(2)}</td>\r\n            <td>&euro; ${(product.amount * product.price).toFixed(2)}</td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div class=\"panel-footer\">\r\n      <button class=\"btn btn-block btn-default\" click.trigger=\"placeOrder()\" disabled.bind=\"order.products.length == 0\">Plaats bestelling</button>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/product.html', ['module'], function(module) { module.exports = "<template class=\"col-xs-3\">\r\n  <button\r\n  class=\"btn btn-block btn-product\">\r\n    ${product.name}\r\n  </button>\r\n</template>\r\n"; });
define('text!components/table-card.html', ['module'], function(module) { module.exports = "<template class=\"col-xs-4\">\r\n  <button\r\n  class=\"btn btn-block btn-table ${isFree ? 'btn-free' : 'btn-occupied'}\"\r\n  if.bind=\"table.isVisible\"\r\n  click.trigger=\"openDetails()\">\r\n    ${table.name}\r\n  </button>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map