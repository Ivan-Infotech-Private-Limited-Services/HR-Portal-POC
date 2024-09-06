import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { PayrollRoutes } from './payroll.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PayrollRoutes,
    SharedModule
  ],
  declarations: [PayrollComponent]
})
export class PayrollModule { }
