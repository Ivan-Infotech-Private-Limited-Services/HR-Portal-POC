import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AttendanceService } from 'src/app/services/attendance.service';
import { PayrollService } from 'src/app/services/payroll.service';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styles: [''],
})
export class PayrollComponent implements OnInit {
  
  Global = new Global();
  form:FormGroup = new FormGroup({
    attendanceMonth: new FormControl('', Validators.required),
    attendanceYear: new FormControl('', Validators.required),
    search:new FormControl(null)
  });
  
  employees:any[] = [];
  selectedAllRowIds: boolean = false;
  selectedRowIds: string[] = []; 
  unselectedRowIds: string[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService,
    private payrollService:PayrollService
  ) { }

  async ngOnInit() {
    this.form.get('attendanceMonth')?.setValue(this.Global.monthMaster[new Date().getMonth()])
    this.form.get('attendanceYear')?.setValue(new Date().getFullYear());
    this.employees = await this.fetchAttendanceSummary()
  }

  async onFilterChange(){
   this.employees = await this.fetchAttendanceSummary()
  }

  async fetchAttendanceSummary() {
    try {
      if(this.form.invalid){
        this.form.markAllAsTouched();
        return
      }
      this.spinner.show()
      const query = {
        attendanceMonth:this.form.get('attendanceMonth')?.value?.value,
        attendanceYear:this.form.get('attendanceYear')?.value,
        search:this.form.get('searchKey')?.value ?? null
      }
      const res = await this.attendanceService.getSummary(query);
      this.spinner.hide()
      return res.docs;
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  rowCheckBoxChecked(event: any, row: any) {
    let rowId = row._id;
    let checkbox = document.querySelector(`[data-checkbox-id="${rowId}"]`) as HTMLInputElement;

    if (checkbox) {
      if (checkbox.checked) {
        const index = this.unselectedRowIds.indexOf(rowId);
        if (index > -1) {
          this.unselectedRowIds.splice(index, 1);
        }
        if (!this.selectedAllRowIds && !this.selectedRowIds.includes(rowId)) {
          this.selectedRowIds.push(rowId);
        }
      } else {
        const index = this.selectedRowIds.indexOf(rowId);
        if (index > -1) {
          this.selectedRowIds.splice(index, 1);
        }
        if (this.selectedAllRowIds && !this.unselectedRowIds.includes(rowId)) {
          this.unselectedRowIds.push(rowId);
        }
      }
    }
  }
  
  allRowsCheckboxChecked(event: any) {
    if (this.selectedAllRowIds) {
      this.unselectedRowIds = [];
      this.selectedAllRowIds = false;
    } else {
      this.selectedRowIds = [];
      this.selectedAllRowIds = true;
    }
  }

  isRowChecked(rowId: string): boolean {
    if (this.selectedAllRowIds) {
      return !this.unselectedRowIds.includes(rowId);
    } else {
      return this.selectedRowIds.includes(rowId);
    }
  }

  isAnyRowsChecked(): boolean {
    return (
      this.selectedAllRowIds == true ||
      this.selectedRowIds.length > 0 ||
      this.unselectedRowIds.length > 0
    );
  }

  
 async runPayroll(){
  try {
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }

    const body = {
      payrollMonth:this.form.get('attendanceMonth')?.value?.value,
      payrollYear:this.form.get('attendanceYear')?.value,
      selectedRowIds:this.selectedRowIds,
      unselectedRowIds:this.unselectedRowIds,
      selectedAllRowIds:this.selectedAllRowIds,
    }

    this.spinner.show()
    const res = await this.payrollService.runPayroll(body);
    if(res){
      this.toastr.success(res.message)
      this.spinner.hide()
    }
  } catch (e:any) {
    this.spinner.hide()
    console.error(e);
    this.toastr.error(e || e.message || 'Something Went Wrong');
  }
}

}
