import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  
  constructor(private httpService:HttpsService) {}

  async search(query:any){
    try {
      return await this.httpService.get('payrolls', query)
    } catch (e) {
      throw e
    }
  }

  async runPayroll(body:any){
    try {
      return await this.httpService.post('payrolls/run', body)
    } catch (e) {
      throw e
    }
  }

  async downloadFile(fileName: string, payload?: Object) {
    try {
      await this.httpService.blob('payrolls/download-report', payload).then(
        (response: HttpResponse<any>) => {
          if (
            response.status !== 200 ||
            response.body.type == 'application/json'
          ) {
            throw { message: 'Something went wrong. Please try again later' };
          }
          saveAs(response.body, fileName);
        },
        (err: any) => {
          throw err;
        }
      );
    } catch (err: any) {
      // this.toastr.error(err.message)
      throw err;
    }
  }

}
