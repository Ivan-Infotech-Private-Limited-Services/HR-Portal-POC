import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token =  sessionStorage.getItem("x-access-token") ?? localStorage.getItem("x-access-token");
    if(token){
      request = request.clone({
        setHeaders:{
          "x-access-token":token  
        }
      });
    }
    
    return next.handle(request).pipe(catchError((err:HttpErrorResponse) => {
      if(err.status === 401) {
        console.log('Unauthorized access!')
      }
      else if(err.status === 404) {
        console.log('Page Not Found!')
      }
      return throwError(() => err)
    }));
  }
}
