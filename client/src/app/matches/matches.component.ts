import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Payment, Debt, Community } from '../shared/sdk/models/index';
import { PaymentApi, DebtApi } from '../shared/sdk/services/index';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.sass'],
  animations: [
    trigger('detailExpand', [
    state('collapsed', style({ height: '0px', minHeight: '0' })),
    state('expanded', style({ height: '*' })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MatchesComponent implements OnInit, AfterViewInit {
  @ViewChild('paidDebtSort') paidDebtSort: MatSort;
  @ViewChild('paidDebtPaginator') paidDebtPaginator: MatPaginator;
  paidDebtDataSource: MatTableDataSource<Debt>;
  expandedElement: Debt | null;
  paidDebts: Debt[] = [];
  paidTotal = 0;
  paidDebtColumns: string[] = [
    'date',
    'community',
    'total',
    'payments',
    'cancelMatch',
    'disburseAll'
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
    private debtApi: DebtApi,
    private paymentApi: PaymentApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.paidDebtDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.getDebts();
  }

  ngAfterViewInit() {
    this.paidDebtDataSource.sort = this.paidDebtSort;
    this.paidDebtDataSource.paginator = this.paidDebtPaginator;
  }

  filter(value: string, isDebt: boolean) {
    this.paidDebtDataSource.filter = value.trim().toLocaleLowerCase();
  }

  openConfirmationDialog(payment: Payment, cancel = false): void {
    if (cancel) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Voulez vous vraiment annuler le décaissement de ce virement ?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cancelDisburse(payment);
        }
      });

      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment décaisser ce virement ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.disburse(payment);
      }
    });
  }

  openDisburseAllConfirmationDialog(debt: Debt) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment décaisser les virements rapprochés à cette déclaration ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.disburseAll(debt);
      }
    });
  }

  openMatchConfirmationDialog(debt: Debt) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment annuler ce rapprochement ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelMatch(debt);
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
    if (this.periodValue !== null) {
      this.paidDebtDataSource.data = this.paidDebts.filter((debt: Debt) => {
        const debtMonth = debt.date.split('/')[0];

        return parseInt(debtMonth, 10) === parseInt(this.periodValue, 10);
      });

      return;
    }

    this.paidDebtDataSource.data = this.paidDebts;
  }

  getPaidTotal(debt: Debt) {
    let total = 0;

    debt.payments.forEach((payment: Payment) => {
      total += parseFloat(payment.credit);
    });

    return total;
  }

  private cancelMatch(debt: Debt) {
    let clean = true;

    debt.payments.forEach((payment: Payment) => {
      if (payment.disbursedAt !== null) {
        clean = false;
        this.snackBar.open('Veuillez annuler les décaissements', null, {duration: 2000});
      }
    });

    if (clean) {
      debt.payments.forEach((payment: Payment) => {
        this.debtApi.unlinkPayments(debt.id, payment.id).subscribe(result => {
          this.snackBar.open('Rapprochement annulé', null, {
            duration: 2000,
          });

          this.getDebts();
        });
      });
    }
  }

  private getDebts() {
    this.paidDebts = [];

    this.debtApi.getMatched().subscribe((debts: Debt[]) => {
      this.paidDebts = debts;
      this.applyPeriod();
    });
  }

  private disburse(payment: Payment): void {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.snackBar.open('Décaissement effectué', null, {duration: 2000});
      this.getDebts();
    });
  }

  private disburseAll(debt: Debt) {
    debt.payments.forEach((payment: Payment) => {
      if (payment.disbursedAt === null) {
        this.disburse(payment);
      }
    });
  }

  private cancelDisburse(payment: Payment): void {
    payment.disbursedAt = null;

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.snackBar.open('Décaissement annulé', null, {duration: 2000});
    });
  }
}

export interface Period {
  name: string;
  value: string;
}


  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  // private tableDataSource: MatTableDataSource<Payment>;
  // private payments: Payment[];

  // displayedColumns: any = [
  //   'select',
  //   'date',
  //   'value',
  //   'label',
  //   'credit',
  //   'disburse'
  // ];
  // pageSize = 10;
  // pageSizeOptions = [5, 10, 20, 50, 100];
  // selection: SelectionModel<Payment> = new SelectionModel<Payment>(true, []);

  // isLoading = false;

  // constructor(
  //   private paymentApi: PaymentApi,
  //   private dialog: MatDialog,
  //   private snackBar: MatSnackBar
  // ) {
  //   this.tableDataSource = new MatTableDataSource<Payment>();
  // }

  // ngOnInit() {
  //   this.getPayments();
  //   this.tableDataSource.filterPredicate = this.filter;
  // }

  // ngAfterViewInit() {
  //   this.tableDataSource.paginator = this.paginator;
  //   this.tableDataSource.sort = this.sort;
  // }

  // public openConfirmationDialog(payment: Payment): void {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '350px',
  //     data: 'Voulez vous vraiment décaisser ce virement ?'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.disburse(payment);
  //     }
  //   });
  // }

  // public doFilter(value: string): void {
  //   this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  // }

  // public isAllSelected() {
  //   return this.selection.selected.length === this.tableDataSource.data.length;
  // }

  // public disburseSelection() {
  //   this.selection.selected.forEach((payment: Payment) => this.disburse(payment));
  //   this.selection.clear();
  // }

  // public masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear():
  //     this.tableDataSource.data.forEach(row => this.selection.select(row))
  //   ;
  // }

  // private getPayments(): void {
  //   this.isLoading = true;

  //   this.paymentApi.getMatched().subscribe((payments: Payment[]) => {
  //     this.payments = payments;
  //     this.tableDataSource.data = this.payments;

  //     this.isLoading = false;
  //   });
  // }

  // private disburse(payment: Payment): void {
  //   payment.disbursedAt = new Date().toString();

  //   this.paymentApi.replaceOrCreate(payment).subscribe(() => {
  //     this.snackBar.open('Décaissement effectué', null, {
  //       duration: 2000,
  //     //  verticalPosition: 'top'
  //     });
  //     this.getPayments();
  //   });
  // }

  // private filter(payment: Payment, filters) {
  //   const matchFilter = [];
  //   const filterArray = filters.split('+');

  //   delete payment.debts;
  //   delete payment.id;

  //   const fields = Object.values(payment).filter(Boolean);

  //   filterArray.forEach(filter => {
  //     const customFilter = [];

  //     fields.forEach(field => {
  //       customFilter.push(field.toLowerCase().includes(filter))
  //     });
  //     matchFilter.push(customFilter.some(Boolean));
  //   });

  //   return matchFilter.every(Boolean);
  // }

//}
