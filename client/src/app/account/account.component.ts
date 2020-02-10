import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSort, MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { trigger, state, transition, style, animate } from '@angular/animations';

import { DebtApi, Debt, Community, Payment, PaymentApi } from '../shared/sdk';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass'],
  animations: [
    trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountComponent implements OnInit {
  @ViewChild('debtSort') debtSort: MatSort;
  @ViewChild('paidDebtSort') paidDebtSort: MatSort;
  @ViewChild('debtPaginator') debtPaginator: MatPaginator;
  @ViewChild('paidDebtPaginator') paidDebtPaginator: MatPaginator;
  debtDataSource: MatTableDataSource<Debt>;
  paidDebtDataSource: MatTableDataSource<Debt>;
  expandedElement: Debt | null;
  community: Community;
  debts: Debt[] = [];
  paidDebts: Debt[] = [];
  debtTotal = 0;
  paidTotal = 0;
  disbursedTotal = 0;
  balance = 0;
  debtColumns: string[] = [
    'date',
    'basis',
    'type',
    'amount'
  ];
  paidDebtColumns: string[] = [
    'date',
    'basis',
    'type',
    'amount',
    'payments'
  ];
  periods: Period[] = [
    {name: 'Janvier', value: '01'},
    {name: 'Février', value: '02'},
    {name: 'Mars', value: '03'},
    {name: 'Avril', value: '04'},
    {name: 'Mai', value: '05'},
    {name: 'Juin', value: '06'},
    {name: 'Juillet', value: '07'},
    {name: 'Aout', value: '08'},
    {name: 'Septembre', value: '09'},
    {name: 'Octobre', value: '10'},
    {name: 'Novembre', value: '11'},
    {name: 'Décembre', value: '12'},
  ]
  periodValue: string = null;

  constructor(
    private route: ActivatedRoute,
    private debtApi: DebtApi,
    private paymentApi: PaymentApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.debtDataSource = new MatTableDataSource<Debt>();
    this.paidDebtDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.community = this.route.snapshot.data.community;
    this.getDebts();
  }

  ngAfterViewInit() {
    this.debtDataSource.sort = this.debtSort;
    this.debtDataSource.paginator = this.debtPaginator;

    this.paidDebtDataSource.sort = this.paidDebtSort;
    this.paidDebtDataSource.paginator = this.paidDebtPaginator;
  }

  filter(value: string, isDebt: boolean) {
    const dataSource = isDebt ? this.debtDataSource : this.paidDebtDataSource;

    dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openConfirmationDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Voulez vous vraiment décaisser ce virement ?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.disburse(payment);
      }
    });
  }

  disbursedStatus(payments: Payment[]): number {
    let count = 0;

    payments.forEach((payment: Payment) => {
      if (payment.disbursedAt !== null) {
        count++;
      }
    });

    return count;
  }

  applyPeriod() {
    if(this.periodValue !== null) {
      this.debtDataSource.data = this.debts.filter((debt: Debt) => {
        const debtMonth = debt.date.split('/')[0];

        return parseInt(debtMonth) === parseInt(this.periodValue);
      });

      this.paidDebtDataSource.data = this.paidDebts.filter((debt: Debt) => {
        const debtMonth = debt.date.split('/')[0];

        return parseInt(debtMonth) === parseInt(this.periodValue);
      });

      this.computeTotals();

      return;
    }

    this.debtDataSource.data = this.debts;
    this.paidDebtDataSource.data = this.paidDebts;
    this.computeTotals();
  }

  private getDebts() {
    this.debts = [];
    this.paidDebts = [];

    this.debtApi.find({
      include: ['payments'],
      where: {
        communityId: this.community.id
      }
    }).subscribe((debts: Debt[]) => {
      this.sortDebts(debts);
      this.applyPeriod();
    });
  }

  private disburse (payment: Payment): void {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.snackBar.open('Décaissement effectué', null, {duration: 2000});
      this.getDebts();
    });
  }

  private sortDebts(debts: Debt[]): void {
    debts.forEach((debt: Debt) => {
      if (debt.payments.length > 0) {
        this.paidDebts.push(debt);

        return;
      }

      this.debts.push(debt);
    });
  }

  private computeTotals(): void {
    let paymentsTotal: number;

    this.debtTotal = 0;
    this.paidTotal = 0;
    this.disbursedTotal = 0;

    this.debtDataSource.data.forEach((debt: Debt) => {
      this.debtTotal += parseFloat(debt.amount);
    });

    this.paidDebtDataSource.data.forEach((debt: Debt) => {
      paymentsTotal = 0;

      debt.payments.forEach((payment: Payment) => {
        if(payment.disbursedAt !== null) {
          this.disbursedTotal += parseFloat(payment.credit);
        }

        paymentsTotal += parseFloat(payment.credit);
      });

      this.paidTotal += paymentsTotal;
    });
  }

}

export interface Period {
  name: string;
  value: string;
}
