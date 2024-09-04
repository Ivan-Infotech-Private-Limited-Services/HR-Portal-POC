import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', pathMatch:"full", redirectTo:"auth"},
  {path:'auth', loadChildren:() => import('./auth/auth.module').then(m => m.AuthModule)},
  {path:'employee', loadChildren:() => import('./pages/employee/employee.module').then(m => m.EmployeeModule)},
  {path:'attendance', loadChildren:() => import('./pages/attendance/attendance.module').then(m => m.AttendanceModule)},
  {path:'payroll', loadChildren:() => import('./pages/payroll/payroll.module').then(m => m.PayrollModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
