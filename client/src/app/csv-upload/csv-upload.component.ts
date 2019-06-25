import { Component, Output, EventEmitter } from '@angular/core';
import { PaymentApi } from '../shared/sdk/services/index';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.sass']
})
export class CsvUploadComponent {
  @Output() uploadStarted = new EventEmitter<any>();
  @Output() uploadDone = new EventEmitter<any>();

  constructor(private paymentApi: PaymentApi) {}

  upload(file: any) {
    this.uploadStarted.emit(true);

    const reader: FileReader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      this.paymentApi.fromCsv(reader.result, () => {
         return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(
        res => {
          this.uploadDone.emit(true);
        },
        error => {
          this.uploadDone.emit(false);
        }
      );
    }
  }

}
