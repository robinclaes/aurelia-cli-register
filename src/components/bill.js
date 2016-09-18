import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Bill{
  @bindable bill = null;
  @bindable id = null;

  constructor(router)
  {
    this.router = router;
  }

  removeBill(){
    var billRef = firebase.database().ref('bills/' + this.id);
    billRef.remove();
    this.router.navigateToRoute('table-overview');
  }
}
