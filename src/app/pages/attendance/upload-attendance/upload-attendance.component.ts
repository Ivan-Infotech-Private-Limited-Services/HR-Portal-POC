import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-upload-attendance',
  templateUrl: './upload-attendance.component.html',
  styles: [''],
})
export class UploadAttendanceComponent implements OnInit {
  selectedFile: string = '';

  form: FormGroup = new FormGroup({
    attendanceMonth: new FormControl('', Validators.required),
    attendanceYear: new FormControl('', Validators.required),
    file: new FormControl('', Validators.required),
    file_source: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UploadAttendanceComponent>,
    private attendanceService: AttendanceService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService
  ) {}

  ngOnInit() {}

  onFileChanged(event: any, formGroup: FormGroup, file: any, target: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file.name;
      formGroup.get(target)?.setValue(file);
    }
  }

  async downloadSampleFile() {
    try {
      if (
        !this.form.get('attendanceMonth')?.valid &&
        !this.form.get('attendanceYear')?.valid
      ) {
        return;
      }

      this.spinner.show()
      const sf = this.data.monthMaster.find(
        (m: any) => m.index == this.form.get('attendanceMonth')?.value?.index
      )?.shortName;

      await this.attendanceService.downloadFile(
        `Attendance-Sample-${
          this.form.get('attendanceYear')?.value
        }-${sf}.xlsx`,
        {
          ...this.form.value,
          attendanceMonth: this.form.get('attendanceMonth')?.value?.value,
        }
      );
      
      this.spinner.hide()
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }

  async uploadFile() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const payload = {
        attendanceMonth: this.form.get('attendanceMonth')?.value?.value,
        attendanceYear: this.form.get('attendanceYear')?.value,
        file: this.form.get('file')?.value
          ? this.form.get('file_source')?.value
          : '',
      };

      this.spinner.show();
      const res = await this.attendanceService.uploadFile(payload);
      if(res){
        this.toastr.success(res.message)
        this.spinner.hide();
        this.dialogRef.close(true)
      }
    } catch (e:any) {
      this.spinner.hide()
      console.error(e);
      this.toastr.error(e || e.message || 'Something Went Wrong');
    }
  }
}
