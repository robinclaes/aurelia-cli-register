import {bindable} from 'aurelia-framework';

export class OrderDetails{
  @bindable order = null;

  activate(){
    alert(this.order);
  }
}
