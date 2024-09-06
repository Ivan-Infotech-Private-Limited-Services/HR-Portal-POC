import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { AttendanceSummaryComponent } from './attendance-summary/attendance-summary.component';

const routes: Routes = [
  { path:'', redirectTo:'upload', pathMatch:'full'},
  { path:'upload', component:AttendanceComponent },
  { path:'summary', component:AttendanceSummaryComponent },
];

export const AttendanceRoutes = RouterModule.forChild(routes);
