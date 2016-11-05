import {bindable} from 'aurelia-framework';

export class OrderDetails{
  @bindable orderId = null;
  @bindable order = null;

  attached(){
    console.log(this.order);
  }

  removeOrder(orderId){
    let ref = firebase.database().ref('bills/B1/orders/'+orderId);
    console.log(ref);
    ref.remove();
  }
}
