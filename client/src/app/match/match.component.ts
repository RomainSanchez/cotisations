import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';

import { Debt, Payment, DebtApi } from '../shared/sdk';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaymentsComponent } from '../payments/payments.component';
import { DebtsComponent } from '../debts/debts.component';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.sass'],
})
export class MatchComponent implements OnInit {
  @ViewChild('paymentsComponent') paymentsComponent: PaymentsComponent;
  @ViewChild('debtsComponent') debtsComponent: DebtsComponent;
  @ViewChild('split') split: SplitComponent;
  @ViewChild('debtPanel') debtPanel: SplitAreaDirective;
  @ViewChild('paymentPanel') paymentPanel: SplitAreaDirective;
  @ViewChild(MatSort) debtSort: MatSort;
  @ViewChild(MatSort) paymentSort: MatSort;
  debts: Debt[] = [];
  payments: Payment[] = [];
  debtTotal: number;
  paymentTotal: number;
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
      data: 'Voulez vous vraiment valider ce rapprochement ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.match();
      }
    });
  }

  public debtSelected(debts: Debt[]) {
    if (this.payments.length < 2 || this.debts.length === 0 || debts.length < this.debts.length) {
      this.debts = debts;
      this.debtDataSource.data = this.debts;
    }

    if (debts.length > 1 && this.payments.length > 1) {
      this.snackBar.open('Seulemennt une déclaration peut être satisfaite par plusieurs virements', null, {
        duration: 2000,
      });

      this.debtsComponent.removeLast();
    }

    this.computeTotal();
  }

  public paymentSelected(payments: Payment[]) {
    if (this.payments.length === 0 || this.debts.length < 2 || payments.length < this.payments.length) {
      this.payments = payments;
      this.paymentDataSource.data = this.payments;
    }

    if (payments.length > 1 && this.debts.length > 1) {
      this.snackBar.open('Seulement un virement peut satisfaire plusieurs déclarations', null, {
        duration: 2000,
      });

      this.paymentsComponent.removeLast();
    }
    console.log(this.payments);

    this.computeTotal();
  }

  public computeTotal() {
    this.debtTotal = 0;
    this.paymentTotal = 0;

    this.debts.forEach(debt => {
      this.debtTotal += parseFloat(debt.amount);
    });

    this.payments.forEach(payment => {
      this.paymentTotal += parseFloat(payment.credit);
    });

    this.balance = this.paymentTotal - this.debtTotal;
  }

  public clear() {
    this.debts = [];
    this.payments = [];
    this.debtsComponent.clear();
    this.paymentsComponent.clear();
  }

  private match() {
    console.log(this.debts);
    console.log(this.payments);
    this.debts.forEach((debt: Debt) => {
      this.payments.forEach((payment: Payment) => {
        this.debtApi.linkPayments(debt.id, payment.id).subscribe(result => {
          this.snackBar.open('Rapprochement effectué', null, {
            duration: 2000,
           // verticalPosition: 'top'
          });

          this.clear();
        });
      });
    });
  }
}
