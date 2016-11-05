export class TableOverview {
  tables = [];

  constructor(){
  }

  activate(){
      var tables = firebase.database().ref('tables');
      tables.on('value', snapshot => {
        this.tables = snapshot.val();
      });
  }
}
