import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SplitComponent, SplitAreaDirective } from 'angular-split';

import { Debt, Payment } from '../shared/sdk';
import { PaymentsComponent } from '../payments/payments.component';

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
  @ViewChild('paymentsComponent') paymentsComponent: PaymentsComponent;
  debts: Debt[] = [];
  payments: Payment[] = [];
  balance: number;

  constructor() { }

  ngOnInit() {
  }

  debtSelected (debts: Debt[]) {
    this.debts = debts;

    if(this.debts.length === 0) {
      this.paymentsComponent.resetSelectedPayments();
    }

    this.computeTotal();
  }

  paymentSelected (payments: Payment[]) {
    this.payments = payments;

    this.computeTotal();
  }

  match() {
    console.log(this.debts, this.payments);
  }

  computeTotal() {
    let debtTotal: number = 0;
    let paymentTotal: number = 0;

    this.debts.forEach(debt => {
      debtTotal += parseFloat(debt.amount);
    });

    this.payments.forEach(payment => {
      paymentTotal += parseFloat(payment.credit);
    });

    this.balance = debtTotal - paymentTotal;
  }

}
