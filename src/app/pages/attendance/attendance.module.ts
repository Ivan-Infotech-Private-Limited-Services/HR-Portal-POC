import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutes } from './attendance.routing';
import { SharedModule } from "../../shared/shared.module";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { UploadAttendanceComponent } from './upload-attendance/upload-attendance.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AttendanceSummaryComponent } from './attendance-summary/attendance-summary.component';

@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutes,
    SharedModule,
    SelectDropDownModule,
    MatDialogModule,
    MatIconModule,
],
  declarations: [AttendanceComponent, UploadAttendanceComponent, AttendanceSummaryComponent]
})
export class AttendanceModule { }
