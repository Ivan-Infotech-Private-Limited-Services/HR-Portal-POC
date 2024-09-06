import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpsService } from './https.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private httpService:HttpsService) {}

  async search(query:any){
    try {
      return await this.httpService.get('attendances', query)
    } catch (e) {
      throw e
    }
  }

  async uploadFile(body:any){
    try {
      return await this.httpService.postFormData('attendances/import-excel', body)
    } catch (e) {
      throw e
    }
  }

  async downloadFile(fileName: string, payload?: Object) {
    try {
      await this.httpService.blob('attendances/export-excel', payload).then(
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

  async createAttendanceSummary(body:any){
    try {
      return await this.httpService.post('attendances/create-summary', body)
    } catch (e) {
      throw e
    }
  }

  async getSummary(query:any){
    try {
      return await this.httpService.get('attendances/get-summary', query)
    } catch (e) {
      throw e
    }
  }
}
