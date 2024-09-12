import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Global } from 'src/app/shared/global';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [''],
})
export class AttendanceComponent implements OnInit {
  Global = new Global();
  form: FormGroup = new FormGroup({
    attendanceMonth: new FormControl('', Validators.required),
    attendanceYear: new FormControl('', Validators.required),
    search: new FormControl(null),
  });

  daysArr: {
    date: number;
    dayName: string;
  }[] = [];

  employees: any[] = [];
  selectedAllRowIds: boolean = false;
  selectedRowIds: string[] = [];
  unselectedRowIds: string[] = [];

  constructor(
    private dialog: MatDialog,
    private attendanceService: AttendanceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.form
      .get('attendanceMonth')
      ?.setValue(this.Global.monthMaster[new Date().getMonth()]);
    this.form.get('attendanceYear')?.setValue(new Date().getFullYear());
    this.getDaysOfAMonth();
    this.employees = await this.fetchAttendances();
  }

  async onFilterChange() {
    this.employees = await this.fetchAttendances();
  }

  getDaysOfAMonth() {
    let m = this.form.get('attendanceMonth')?.value;
    let y = this.form.get('attendanceYear')?.value;
    if (!m || !y) {
      return;
    }
    const month = moment(y + '-' + m, 'YYYY-MM');
    const daysInMonth = month.daysInMonth();
    this.daysArr = [];
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = month.clone().date(date);
      const dayName = currentDate.format('ddd');
      this.daysArr.push({
        date,
        dayName,
      });
    }
  }

  openUploadAttendanceDialog() {
    const dialogRef = this.dialog.open(UploadAttendanceComponent, {
      data: {
        monthMaster: this.Global.monthMaster,
        yearMaster: this.Global.generateYears(2, 'before'),
      },
      minWidth: '550px',
      width: 'min-content',
      height: 'fit-content',
      maxHeight: '90vh',
      hasBackdrop: true,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.status) {
        this.employees = await this.fetchAttendances();
      }
    });
  }

  async fetchAttendances() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const query = {
        attendanceMonth: this.form.get('attendanceMonth')?.value?.value,
        attendanceYear: this.form.get('attendanceYear')?.value,
        search: this.form.get('searchKey')?.value ?? null,
      };
      this.spinner.show();
      const res = await this.attendanceService.search(query);
      this.spinner.hide();
      return res.docs;
    } catch (e: any) {
      this.spinner.hide();
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  rowCheckBoxChecked(event: any, row: any) {
    let rowId = row._id;
    let checkbox = document.querySelector(
      `[data-checkbox-id="${rowId}"]`
    ) as HTMLInputElement;

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

  async summarizeAttendance() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const body = {
        attendanceMonth: this.form.get('attendanceMonth')?.value?.value,
        attendanceYear: this.form.get('attendanceYear')?.value,
        selectedRowIds: this.selectedRowIds,
        unselectedRowIds: this.unselectedRowIds,
        selectedAllRowIds: this.selectedAllRowIds,
      };

      this.spinner.show();
      const res = await this.attendanceService.createAttendanceSummary(body);
      if (res) {
        this.toastr.success(res.message);
        this.spinner.hide();
      }
    } catch (e: any) {
      this.spinner.hide();
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }
}
