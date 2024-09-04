import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthsService } from 'src/app/services/auths.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    corpId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authsService: AuthsService, private router:Router) {}

  ngOnInit() {}

  async login() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const res = await this.authsService.login(this.form.value);
      if(res){
        this.router.navigateByUrl('/employee')
      }
      
    } catch (e) {
      console.error(e);
    }
  }
}
