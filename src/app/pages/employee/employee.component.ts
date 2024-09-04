import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees:any[] = []
  constructor(
    private dialog: MatDialog,
    private usersService:UsersService
  ) { }

  async ngOnInit() {
   this.employees = await this.fetchEmployeeList("employee")
  }

  async fetchEmployeeList(userType:string){
    try {
      const res = await this.usersService.search({userType})
      console.log(res);
      return res.docs
    } catch (e) {
      console.error(e);
      
    }
  }

  async AddEmployee(){
    const users = await this.fetchEmployeeList("staff");    

    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: {
        hods:users
      },
      minWidth: '650px',
      width: 'min-content',
      height: 'fit-content',
      maxHeight: '90vh',
      hasBackdrop: true,
      disableClose: true,
      autoFocus:false
    });
  }

}
