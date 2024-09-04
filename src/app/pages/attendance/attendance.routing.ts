import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';

const routes: Routes = [
  { path:'', component:AttendanceComponent },
];

export const AttendanceRoutes = RouterModule.forChild(routes);
