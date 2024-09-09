import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { PayrollRoutes } from './payroll.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { PayrollReportComponent } from './payroll-report/payroll-report.component';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutes,
    SharedModule,
    SelectDropDownModule
  ],
  declarations: [PayrollComponent, PayrollReportComponent]
})
export class PayrollModule { }
