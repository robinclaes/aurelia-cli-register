
// A ValueConverter for iterating an Object's properties inside of a repeat.for in Aurelia
export class EuroValueConverter {
    toView(number) {

        number = number.toFixed(2);
        number = number.replace('.',',');

        return number;
    }
}

/**
 * Usage
*/
