import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { AttendanceRoutes } from './attendance.routing';

@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutes
  ],
  declarations: [AttendanceComponent]
})
export class AttendanceModule { }
