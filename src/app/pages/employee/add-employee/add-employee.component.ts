import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsService } from 'src/app/core/services/validators.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  employeeId?:string;
  earningHeads = {
    basic: 0,
    hra: 0,
    ca: 0,
  };
  form: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    hodId: new FormControl('', Validators.required),
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl(''),
    incentiveRate: new FormControl(null,Validators.required),
    wageRate: new FormControl(null,Validators.required),
    earningHeads: new FormControl({
      basic: 40,
      hra: 30,
      ca: 30,
    }),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    private usersService:UsersService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService
  ) {
    if(data.employee){
      this.employeeId = data?.employee?._id
    }
  }
  
  ngOnInit() {
    if(this.employeeId){
      ValidatorsService.updateForm(this.form, {...this.data.employee,...this.data?.employee?.details })
      this.calculateWages()
    }
  }

  calculateWages() {
    const amount = this.form.get('wageRate')?.value;
    const heads = this.form.get('earningHeads')?.value;
    this.earningHeads.basic = (heads.basic * amount) / 100
    this.earningHeads.hra = (heads.hra * amount) / 100
    this.earningHeads.ca = (heads.ca * amount) / 100
  }

  async create(){
    try {
      if(this.form.invalid){
        this.form.markAllAsTouched();
        return
      }
      this.spinner.show();
      const res =await this.usersService.create({...this.form.value,hodId:this.form.get("hodId")?.value?._id});
      if(res){
        this.toastr.success(res.message)
        this.spinner.hide()
        this.dialogRef.close(true)
      }
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  async update(){
    try {
      if(this.form.invalid || !this.employeeId){
        this.form.markAllAsTouched();
        return
      }
      this.spinner.show();
      const res = await this.usersService.update(this.employeeId,  {...this.form.value, hodId:this.form.get("hodId")?.value?._id});
      if(res){
        this.toastr.success(res.message)
        this.spinner.hide()
        this.dialogRef.close(true)
      }
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }
}
