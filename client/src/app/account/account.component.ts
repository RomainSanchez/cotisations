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
  debtTotal: number = 0;
  paidTotal: number = 0;
  disbursedTotal: number = 0;
  balance: number = 0;
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

  private getDebts() {
    this.debtApi.find({
      include: ['payments'],
      where: {
        communityId: this.community.id
      }
    }).subscribe((debts: Debt[]) => {
      this.sortDebts(debts);
      this.computeTotals();
    });
  }

  private disburse (payment: Payment): void {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.snackBar.open('Décaissement effectué', null, {
        duration: 2000,
      //  verticalPosition: 'top'
      });
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

    this.debtDataSource.data = this.debts;
    this.paidDebtDataSource.data = this.paidDebts;
  }

  private computeTotals(): void {
    let paymentsTotal: number;

    this.debts.forEach((debt: Debt) => {
      this.debtTotal += parseFloat(debt.amount);
    });

    this.paidDebts.forEach((debt: Debt) => {
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
