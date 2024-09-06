import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private storage: StorageService,
    private router: Router,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.storage.getToken();
    if (isAuthenticated) {
      this.router.navigateByUrl(`/employee`);
      return false;
    }
    else {
      return true;
    }
  }

}
