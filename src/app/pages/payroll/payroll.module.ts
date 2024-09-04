import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { PayrollRoutes } from './payroll.routing';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutes
  ],
  declarations: [PayrollComponent]
})
export class PayrollModule { }
