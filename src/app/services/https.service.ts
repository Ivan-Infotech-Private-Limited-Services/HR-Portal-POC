import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpsService {
  readonly BASE_URL: string = environment.apiUrl;
  readonly BASE_HREF: string = environment.BASEHREF;
  constructor(private http: HttpClient) {}

  get(url:string, query: any): any {
    return firstValueFrom(this.http.get<any>(`${this.BASE_URL}/${url}`, {params:query})).catch(this.handleError);
  }

  async post(url: string, payload: any) {
    return await firstValueFrom(
      this.http.post<any>(`${this.BASE_URL}/${url}`, payload, {
        headers:{
          'Content-Type': 'application/json'
        }
      })
    ).then((response: any) => {
        if (response?.status !== 'success') {
          if (response?.val_msg) {
            const { val_msg } = response;
            for (const key in val_msg) {
              if (Object.prototype.hasOwnProperty.call(val_msg, key)) {
                const element: any = val_msg[key];
                if (element.message) {
                  return this.handleError(
                    element.message || 'Something went wrong!'
                  );
                }
              }
            }
            return 'Validation Error: Please check all the fields correctly';
          }
          return this.handleError(
            response?.error ||
              response?.message ||
              response?.code ||
              'Something went wrong!'
          );
        }
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.status === 0) {
      return Promise.reject<string>('There is no internet connection');
    }
    if (error.status) {
      if (error.status === 401) {
        localStorage.clear();
        // window.location.href = '/';
        return Promise.reject<string>(
          error.statusText + '! No user found with your token'
        );
      }
      if (error.status === 403) {
        localStorage.clear();
        // window.location.href = '/';
        return Promise.reject<string>('Your are logged Out');
      }
      return Promise.reject<string>(error?.error?.message);
    }
    // if (
    //   (error.message) ||
    //   error == 'No user found with your token'
    // ) {
    //   localStorage.clear();
    //   window.location.href = '/';
    // }
    return Promise.reject<string>(error.message || error);
  }
}
