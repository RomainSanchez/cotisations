import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';

import { Debt, Payment, DebtApi } from '../shared/sdk';
import { PaymentsComponent } from '../payments/payments.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchComponent implements OnInit {
  @ViewChild('split') split: SplitComponent;
  @ViewChild('debtPanel') debtPanel: SplitAreaDirective;
  @ViewChild('paymentPanel') paymentPanel: SplitAreaDirective;
  @ViewChild(MatSort) debtSort: MatSort;
  @ViewChild(MatSort) paymentSort: MatSort;
  debts: Debt[] = [];
  payments: Payment[] = [];
  balance: number;
  debtColumns: string[] = [
    'date',
    'community',
    'basis',
    'type',
    'amount'
  ];
  paymentColumns: string[] = [
    'date',
    'value',
    'label',
    'credit'
  ];
  debtDataSource: MatTableDataSource<Debt>;
  paymentDataSource: MatTableDataSource<Payment>;

  constructor(
    private debtApi: DebtApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.debtDataSource = new MatTableDataSource<Debt>();
    this.paymentDataSource = new MatTableDataSource<Payment>();
  }

  ngOnInit() {
    this.debtDataSource.sort = this.debtSort;
    this.paymentDataSource.sort = this.paymentSort;
  }

  public openConfirmationDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Voulez vous vraiment valider ce rapprochement ?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.match();
      }
    });
  }

  public debtSelected (debts: Debt[]) {
    this.debts = debts;
    this.debtDataSource.data = this.debts;

    this.computeTotal();
  }

  public paymentSelected (payments: Payment[]) {
    this.payments = payments;
    this.paymentDataSource.data = this.payments;

    this.computeTotal();
  }

  public computeTotal() {
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

  private match() {
    this.debts.forEach((debt: Debt) => {
      this.payments.forEach((payment: Payment) => {
        this.debtApi.linkPayments(debt.id, payment.id).subscribe(result => {
          this.snackBar.open('Rapprochement effectué');
        })
      });
    });
  }

}
