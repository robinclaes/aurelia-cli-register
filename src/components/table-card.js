import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class TableCard{
  @bindable table = null;
  isFree = true;

  constructor(router)
  {
    this.router = router;
  }

  attached(){
    var billRef = firebase.database().ref('bills/' + this.table.name);
    billRef.once('value', snapshot => {
      if(snapshot.exists()){
        this.isFree = false;
      }
    });
  }

  openDetails(table)
  {
    this.router.navigateToRoute("table-details", {id:this.table.name});
  }
}
