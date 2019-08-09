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

    const headers = (headers) => {
     headers.append('Content-Type', 'multipart/form-data');
    };

    let data = new FormData();

    data.append('file', file);

    this.paymentApi.fromCsv(data, headers).subscribe(
      res => {
        this.uploadDone.emit(true);
      },
      error => {
        this.uploadDone.emit(false);
      }
    );
  }

}
