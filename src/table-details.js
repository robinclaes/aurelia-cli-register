import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class TableDetails {
  heading = 'Order';
  bill = null;
  orders = null;
  router = null;
  tableId = null;

  constructor(router)
  {
    this.router = router;
  }

  activate(params){
    this.tableId = params.id;
    var billRef = firebase.database().ref('bills/'+params.id);
    billRef.orderByValue().on('value', snapshot => {
      if(snapshot.exists()){
        this.bill = snapshot.val();

        this.bill.totalAmount = 0;

        for(var key in this.bill.orders)
        {
          for(var product of this.bill.orders[key].products)
          {
            this.bill.totalAmount += product.price * product.amount;
          }
        }
      }
    });

  }

  back()
  {
    this.router.navigateToRoute("table-overview");
  }

  newOrder()
  {
    this.router.navigateToRoute("new-order", {id:this.tableId});
  }
}
