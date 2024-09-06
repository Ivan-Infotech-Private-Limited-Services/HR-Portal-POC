import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeRoutes } from './employee.routing';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    EmployeeRoutes,
    SharedModule,
    MatDialogModule,
    MatSelectModule,
    SelectDropDownModule,
    MatIconModule
  ],
  declarations: [EmployeeComponent, AddEmployeeComponent]
})
export class EmployeeModule { }
