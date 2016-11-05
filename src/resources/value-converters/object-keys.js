export class ObjectKeysValueConverter {
  toView(obj) {
    return Reflect.ownKeys(obj);
  }
}
