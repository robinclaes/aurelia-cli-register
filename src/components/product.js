import {bindable} from 'aurelia-framework';

export class Product{
  @bindable product = null;
  products = null;

  constructor(router)
  {
  }
}
