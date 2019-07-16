import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'siret'})
export class Siret implements PipeTransform {
  transform(value: string): string {
    let elements = [];

    for(let i = 0; i < value.length; i += 3) {
      elements.push(value.substring(i, i + 3));
    }

    return elements.join(' ');
  }
}
