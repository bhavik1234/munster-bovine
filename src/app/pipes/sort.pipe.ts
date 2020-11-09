import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (value.length <= 1) { return value; } // array with only one item
    if (!column || column === '') {
      if (order === 'asc') {
        console.log("asc")
        return value.sort()
      }
      else {
        console.log("Des")
        return value.sort().reverse();
      }
    } // sort 1d array
    return orderBy(value, [column], [order]);
  }

}
