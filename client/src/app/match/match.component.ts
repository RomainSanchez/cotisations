import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SplitComponent, SplitAreaDirective } from 'angular-split';

import { Debt, Payment } from '../shared/sdk';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchComponent implements OnInit {
  @ViewChild('split') split: SplitComponent;
  @ViewChild('debt-panel') debtPanel: SplitAreaDirective;
  @ViewChild('payment-panel') paymentPanel: SplitAreaDirective;
  private debt: Debt;
  private payments: Payment[] = [];

  constructor() { }

  ngOnInit() {
  }

  selectedDebt (debt: Debt) {
    this.debt = debt;
    console.log(this.debt);
  }

  selectedPayment (payment: Payment) {
    this.payments.push(payment);
    console.log(this.payments);
  }

}
