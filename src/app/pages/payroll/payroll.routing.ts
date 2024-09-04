import { Routes, RouterModule } from '@angular/router';
import { PayrollComponent } from './payroll.component';

const routes: Routes = [
  { path:'', component:PayrollComponent },
];

export const PayrollRoutes = RouterModule.forChild(routes);
