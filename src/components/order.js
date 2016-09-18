import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Order{
  @bindable order = null;
  @bindable id = null;
  router = null;

  constructor(router){
    this.router = router;
  }

  placeOrder(){
    if(this.id)
    {
      this.order.time = new Date().toTimeString().split(' ')[0];
      var ordersRef = firebase.database().ref('bills/' + this.id + '/orders');
      ordersRef.push(JSON.parse(JSON.stringify(this.order)));
      this.router.navigateToRoute('table-details',{id:this.id});
    }
  }
}
