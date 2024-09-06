import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private authsService: AuthsService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  async login() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      this.spinner.show()
      const res = await this.authsService.login(this.form.value);
      this.spinner.hide();
      
      if (res) {
        this.router.navigateByUrl('/employee');
        this.toastr.success(res.message);
      }
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }
}
