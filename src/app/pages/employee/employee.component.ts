import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { UsersService } from 'src/app/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styles: [''],
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  searchKey?: string = '';
  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService,
  ) {}

  async ngOnInit() {
    this.employees = await this.fetchEmployeeList('employee');
  }

  async search() {
    if (!this.searchKey) return;
    this.employees = await this.fetchEmployeeList('employee', this.searchKey);
  }

  async fetchEmployeeList(userType: string, search: any = null) {
    try {
      this.spinner.show();
      const res = await this.usersService.search({ userType, search });
      this.spinner.hide();
      return res.docs;
    } catch (e: any) {
      this.spinner.hide();
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  async editEmployee(employeeId?: string) {
    try {
      this.spinner.hide();
      const res = await this.usersService.getById(employeeId);
      this.openAddEmployeeDialog(res.body);
    } catch (e: any) {
      this.spinner.hide();
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  async openAddEmployeeDialog(employee?: any) {
    const hods = await this.fetchEmployeeList('staff');
    this.dialog
      .open(AddEmployeeComponent, {
        data: {
          hods: hods,
          employee,
        },
        minWidth: '650px',
        width: 'min-content',
        height: 'fit-content',
        maxHeight: '90vh',
        hasBackdrop: true,
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          setTimeout(() => {
            this.fetchEmployeeList('employee');
          }, 2000);
        }
      });
  }
}
