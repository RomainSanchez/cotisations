import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelValidatorService {

  constructor() { }

  isValid (label: string): RegExpMatchArray {
    const regularExpressions = [
      new RegExp('COTIS_\\d{4}_\\d{2}_d{14}', 'i'),
      new RegExp('COTIS\\s\\d{4}\\s\\d{2}\\s\\d{14}', 'i')
    ];

    return (label && label !== ' ' && label !== 'Libellé') &&
      (label.match(regularExpressions[0]) || label.match(regularExpressions[1]));
  }
}
