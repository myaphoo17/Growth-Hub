import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterData'
})
export class FilterDataPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item => 
      Object.values(item).some(value =>
        (value !== null && value !== undefined && value.toString().toLowerCase().includes(searchTerm))
      )
    );
  }
}
