import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
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
    private usersService:UsersService
  ) {
    console.log(data);
  }

  ngOnInit() {}

  calculateWages(e: any) {
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
      this.form.get("hodId")?.setValue(this.form.get("hodId")?.value?._id)
      await this.usersService.create(this.form.value);
      this.dialogRef.close(true)
    } catch (err) {
      console.error(err);
    }
  }
}
