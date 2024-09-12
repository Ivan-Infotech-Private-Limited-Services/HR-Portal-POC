import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/services/payroll.service';
import { Global } from 'src/app/shared/global';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styles: [''],
})
export class PayrollReportComponent implements OnInit {

  Global = new Global();
  form:FormGroup = new FormGroup({
    payrollMonth: new FormControl('', Validators.required),
    payrollYear: new FormControl('', Validators.required),
    search:new FormControl(null)
  });
  
  employees:any[] = [];
  selectedAllRowIds: boolean = false;
  selectedRowIds: string[] = []; 
  unselectedRowIds: string[] = [];
  
  constructor(
    private payrollService: PayrollService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.form.get('payrollMonth')?.setValue(this.Global.monthMaster[new Date().getMonth()])
    this.form.get('payrollYear')?.setValue(new Date().getFullYear());
    this.employees = await this.fetchReportLisiting()
  }

  async onFilterChange(){
   this.employees = await this.fetchReportLisiting();
  }

  async fetchReportLisiting() {
    try {
      if(this.form.invalid){
        this.form.markAllAsTouched();
        return
      }
      this.spinner.show()
      const query = {
        payrollMonth:this.form.get('payrollMonth')?.value?.value,
        payrollYear:this.form.get('payrollYear')?.value,
        search:this.form.get('searchKey')?.value ?? null
      }
      const res = await this.payrollService.search(query);
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

  async downloadSalaryReport() {
    try {
      if (
        !this.form.get('payrollMonth')?.valid &&
        !this.form.get('payrollYear')?.valid
      ) {
        return;
      }
      const body = {
        payrollMonth:this.form.get('payrollMonth')?.value?.value,
        payrollYear:this.form.get('payrollYear')?.value,
        selectedRowIds:this.selectedRowIds,
        unselectedRowIds:this.unselectedRowIds,
        selectedAllRowIds:this.selectedAllRowIds,
      }
      this.spinner.show()

      const sf = this.Global.monthMaster.find(
        (m: any) => m.index == this.form.get('payrollMonth')?.value?.index
      )?.shortName;

      await this.payrollService.downloadFile(
        `Payroll-Report-${
          this.form.get('payrollYear')?.value
        }-${sf}.xlsx`,
        body
      );
      
      this.spinner.hide()
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

}
