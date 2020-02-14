import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Payment, Debt } from '../shared/sdk/models/index';
import { PaymentApi, DebtApi } from '../shared/sdk/services/index';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExportService } from '../services/export';
import * as moment from 'moment';

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
  ];
  periodValue: string = null;

  constructor(
    private debtApi: DebtApi,
    private paymentApi: PaymentApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private exporter: ExportService
  ) {
    this.paidDebtDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.getDebts();
    this.paidDebtDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.paidDebtDataSource.sort = this.paidDebtSort;
    this.paidDebtDataSource.paginator = this.paidDebtPaginator;
  }

  doFilter(value: string, isDebt: boolean) {
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

  getPaidTotal(debt: Debt) {
    let total = 0;

    debt.payments.forEach((payment: Payment) => {
      total += parseFloat(payment.credit);
    });

    return total;
  }

  export() {
    const addedIds = [];
    const data = [];
    const inputFormat = 'D/M/YY';
    const outputFormat = 'DD/MM/YYYY';

    this.paidDebtDataSource.data.forEach((debt: Debt) => {
      debt.payments.forEach((payment: Payment) => {
        if (payment.disbursedAt !== null && addedIds.indexOf(payment.id) === -1) {
          data.push({
            Période: debt.date,
            Collectivité: debt.community.label,
            'Montant déclaré': debt.amount,
            'Montant versé': payment.credit,
            Libellé: payment.label,
            'Date d\'encaissement': moment(payment.date, inputFormat).format(outputFormat),
            'Date de valeur': moment(payment.valueDate, inputFormat).format(outputFormat),
            'Date de décaissement': moment(payment.disbursedAt).format(outputFormat)
          });

          addedIds.push(payment.id);
        }
      });
    });

    this.exporter.export(data, `decaissements_${moment().format('DD-MM-YYYY')}`);
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
      this.paidDebtDataSource.data = debts;
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

  private filter = (debt: Debt, filters: any) => {
    const matchFilter = [];
    const filterArray = filters.split('+');
    const columns = [
      debt.agirheCode,
      debt.amount,
      debt.basis,
      debt.community.label,
      debt.community.siret,
      debt.date,
      debt.type,
      this.getPaidTotal(debt) + ''
    ];

    filterArray.forEach(filter => {
      const customFilter = [];

      columns.forEach(column => {
        customFilter.push(column.toLowerCase().includes(filter));
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }
}

export interface Period {
  name: string;
  value: string;
}
