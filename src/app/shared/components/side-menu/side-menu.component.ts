import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  isActive(routeString: string): boolean {
    const url = this.router.url.split("/");

    if (url[1] == routeString) {
      return true;
    }
    return false;
  }

  logout(){
    localStorage.clear()
    sessionStorage.clear()
    this.router.navigateByUrl('')
  }
}
