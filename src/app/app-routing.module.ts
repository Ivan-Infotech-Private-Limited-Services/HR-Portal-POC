import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CompanyGuard } from './core/guards/company.guard';

const routes: Routes = [
  {path:'', pathMatch:"full", redirectTo:"auth"},
  {path:'auth', loadChildren:() => import('./auth/auth.module').then(m => m.AuthModule), canActivate:[AuthGuard]},
  {path:'employee', loadChildren:() => import('./pages/employee/employee.module').then(m => m.EmployeeModule), canActivate:[CompanyGuard]},
  {path:'attendance', loadChildren:() => import('./pages/attendance/attendance.module').then(m => m.AttendanceModule), canActivate:[CompanyGuard]},
  {path:'payroll', loadChildren:() => import('./pages/payroll/payroll.module').then(m => m.PayrollModule), canActivate:[CompanyGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
