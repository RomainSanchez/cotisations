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
  debt: Debt;
  payments: Payment[] = [];

  constructor() { }

  ngOnInit() {
  }

  debtSelected (debt: Debt) {
    this.paymentsComponent.resetSelectedPayments();

    this.debt = debt;
  }

  paymentSelected (payments: Payment[]) {
    this.payments = payments;
  }

}
