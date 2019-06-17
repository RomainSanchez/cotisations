import { Component, OnInit } from '@angular/core';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.sass']
})
export class CsvUploadComponent implements OnInit {

  constructor(private paymentApi: PaymentApi) {}

  ngOnInit() {
  }

  private upload(file: any) {
    const reader: FileReader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      const formData = new FormData();

      formData.append('csv', file);

      this.paymentApi.fromCsv(reader.result, () => { return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')}).subscribe(res => {
        console.log(res);
      });
    }
  }

}
