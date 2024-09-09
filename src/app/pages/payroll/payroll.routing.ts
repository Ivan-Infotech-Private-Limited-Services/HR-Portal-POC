import { Routes, RouterModule } from '@angular/router';
import { PayrollComponent } from './payroll.component';
import { PayrollReportComponent } from './payroll-report/payroll-report.component';

const routes: Routes = [
  { path:'run', component:PayrollComponent },
  { path:'report', component:PayrollReportComponent },
];

export const PayrollRoutes = RouterModule.forChild(routes);
